/**
 * 验证错误类
 * 
 * 用于文件验证过程中抛出特定错误
 * 继承自 Error 类，添加了自定义名称
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * CDL数据接口
 * 
 * 定义从ALE文件中提取的关键CDL数据结构
 * 包含片段名称、SOP参数和饱和度参数
 */
interface CDLData {
  Name: string;
  ASC_SOP: string;
  ASC_SAT: string;
}

/**
 * 必需列常量和类型
 * 
 * 定义ALE文件中必须存在的列
 * 使用 readonly 数组和类型提取来确保类型安全
 */
const REQUIRED_COLUMNS = ['Name', 'ASC_SOP', 'ASC_SAT'] as const;
type RequiredColumn = typeof REQUIRED_COLUMNS[number];

/**
 * CDL转换器类
 * 
 * 提供将ALE文件转换为CDL文件的静态方法
 */
export class CDLConverter {
  /**
   * 验证必需列是否存在
   * 
   * 检查ALE文件的列是否包含所有必需的列
   * 
   * @param headers - ALE文件的列标题数组
   * @returns 包含验证结果和缺失列的对象
   */
  private static validateRequiredColumns(headers: string[]): { 
    isValid: boolean; 
    missingColumns: RequiredColumn[] 
  } {
    const missingColumns = REQUIRED_COLUMNS.filter(
      col => !headers.includes(col)
    );
    return {
      isValid: missingColumns.length === 0,
      missingColumns
    };
  }

  /**
   * 查找列标题行
   * 
   * 在ALE文件中定位列标题行
   * 查找'Column'标记后的非注释行
   * 
   * @param lines - ALE文件的行数组
   * @returns 包含列标题行的对象，若未找到则为null
   */
  private static findColumnSection(lines: string[]): { 
    columnLine: string | null 
  } {    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === 'Column') {
        for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
          const headerLine = lines[j].trim();
          if (headerLine && !headerLine.startsWith('#')) {
            return { columnLine: headerLine };
          }
        }
        break;
      }
    }
    
    return { columnLine: null };
  }

  /**
   * 解析SOP字符串
   * 
   * 将ASC_SOP字符串解析为斜率、偏移和幂值数组
   * 
   * @param sopString - 格式为 "(1.0 1.0 1.0)(0.0 0.0 0.0)(1.0 1.0 1.0)" 的字符串
   * @returns 包含三个参数组的字符串数组
   * @throws ValidationError 如果SOP格式无效
   */
  private static parseSOPString(sopString: string): string[] {
    // 提取圆括号中的内容
    const matches = sopString.match(/\((.*?)\)/g);
    if (!matches || matches.length !== 3) {
      throw new ValidationError('Invalid ASC_SOP format');
    }

    return matches.map(group => group.replace(/[()]/g, '').trim());
  }

  /**
   * 解析ALE文件内容
   * 
   * 分析ALE文件并提取CDL数据
   * 
   * @param content - ALE文件的文本内容
   * @returns CDL数据对象数组
   * @throws ValidationError 如果文件格式无效或缺少必需列
   */
  private static parseALEContent(content: string): CDLData[] {
    try {
      const lines = content.split(/\r?\n/);

      // 查找列标题行
      const { columnLine } = this.findColumnSection(lines);
      if (!columnLine) {
        throw new ValidationError('无法找到列标题行');
      }

      // 解析列标题
      const headers = columnLine.split('\t').map(h => h.trim());
      const { isValid, missingColumns } = this.validateRequiredColumns(headers);
      
      if (!isValid) {
        throw new ValidationError('Missing required columns: ' + missingColumns.join(', '));
      }

      // 提取数据行
      const data: CDLData[] = [];
      let readingData = false;

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // 检测数据部分开始
        if (trimmedLine === 'Data') {
          readingData = true;
          continue;
        }

        // 处理数据行
        if (readingData && trimmedLine && !trimmedLine.startsWith('#')) {
          const values = trimmedLine.split('\t');
          
          if (values.length === headers.length) {
            const rowData = {} as Record<string, string>;
            headers.forEach((header, index) => {
              rowData[header] = values[index]?.trim() || '';
            });

            // 确保关键数据都存在
            if (
              rowData['Name'] && 
              rowData['ASC_SOP'] && 
              rowData['ASC_SAT']
            ) {
              data.push({
                Name: rowData['Name'],
                ASC_SOP: rowData['ASC_SOP'],
                ASC_SAT: rowData['ASC_SAT']
              });
            }
          }
        }
      }

      // 验证是否找到有效数据
      if (data.length === 0) {
        throw new ValidationError('没有找到有效的 CDL 数据');
      }

      return data;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('ALE 文件格式无效');
    }
  }

  /**
   * 生成XML内容
   * 
   * 将CDL数据转换为标准ASC-CDL XML格式
   * 
   * @param data - CDL数据对象
   * @returns 格式化的XML字符串
   * @throws ValidationError 如果生成过程出错
   */
  private static generateXMLContent(data: CDLData): string {
    try {
      // 解析SOP参数
      const [slope, offset, power] = this.parseSOPString(data.ASC_SOP);

      // 生成标准ASC-CDL XML
      return `<?xml version="1.0" encoding="UTF-8"?>
<ColorDecisionList xmlns="urn:ASC:CDL:v1.01">
    <ColorDecision>
        <ColorCorrection>
            <SOPNode>
                <Description>${data.Name}</Description>
                <Slope>${slope}</Slope>
                <Offset>${offset}</Offset>
                <Power>${power}</Power>
            </SOPNode>
            <SATNode>
                <Saturation>${data.ASC_SAT}</Saturation>
            </SATNode>
        </ColorCorrection>
    </ColorDecision>
</ColorDecisionList>`;
    } catch (error) {
      throw new ValidationError('生成 XML 内容时出错');
    }
  }

  /**
   * 转换ALE文件到CDL
   * 
   * 公共方法，将ALE文件转换为多个CDL文件
   * 
   * @param aleFile - ALE文件对象
   * @returns Promise 包含文件名和内容对象的数组
   * @throws 从解析或生成过程中传递的错误
   */
  public static async convertALEtoCDL(aleFile: File): Promise<{ filename: string, content: string }[]> {
    try {
      // 读取文件内容
      const text = await aleFile.text();
      // 解析ALE数据
      const aleData = this.parseALEContent(text);
      
      // 为每个片段生成CDL文件
      return aleData.map(data => ({
        // 创建文件名，移除原有扩展名并添加.cdl扩展名
        filename: `${data.Name.replace(/\.[^/.]+$/, "")}.cdl`,
        // 生成XML内容
        content: this.generateXMLContent(data)
      }));
    } catch (error) {
      throw error;
    }
  }
}