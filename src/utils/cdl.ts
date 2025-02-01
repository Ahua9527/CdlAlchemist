// src/utils/cdl.ts
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

interface CDLData {
  Name: string;
  ASC_SOP: string;
  ASC_SAT: string;
}

const REQUIRED_COLUMNS = ['Name', 'ASC_SOP', 'ASC_SAT'] as const;
type RequiredColumn = typeof REQUIRED_COLUMNS[number];

export class CDLConverter {
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

  private static parseSOPString(sopString: string): string[] {
    // 输入格式例如: "(1.1072 1.0000 1.0000)(-0.1072 0.0000 0.0000)(1.0000 1.0000 1.0000)"
    // 将其分解为三组值
    const matches = sopString.match(/\((.*?)\)/g);
    if (!matches || matches.length !== 3) {
      throw new ValidationError('Invalid ASC_SOP format');
    }

    return matches.map(group => group.replace(/[()]/g, '').trim());
  }

  private static parseALEContent(content: string): CDLData[] {
    try {
      const lines = content.split(/\r?\n/);

      const { columnLine } = this.findColumnSection(lines);
      if (!columnLine) {
        throw new ValidationError('无法找到列标题行');
      }

      const headers = columnLine.split('\t').map(h => h.trim());
      const { isValid, missingColumns } = this.validateRequiredColumns(headers);
      
      if (!isValid) {
        throw new ValidationError('Missing required columns: ' + missingColumns.join(', '));
      }

      const data: CDLData[] = [];
      let readingData = false;

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (trimmedLine === 'Data') {
          readingData = true;
          continue;
        }

        if (readingData && trimmedLine && !trimmedLine.startsWith('#')) {
          const values = trimmedLine.split('\t');
          
          if (values.length === headers.length) {
            const rowData = {} as Record<string, string>;
            headers.forEach((header, index) => {
              rowData[header] = values[index]?.trim() || '';
            });

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

  private static generateXMLContent(data: CDLData): string {
    try {
      // 解析 ASC_SOP 字符串为三组值
      const [slope, offset, power] = this.parseSOPString(data.ASC_SOP);

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

  public static async convertALEtoCDL(aleFile: File): Promise<{ filename: string, content: string }[]> {
    try {
      const text = await aleFile.text();
      const aleData = this.parseALEContent(text);
      
      return aleData.map(data => ({
        filename: `${data.Name.replace(/\.[^/.]+$/, "")}.cdl`,
        content: this.generateXMLContent(data)
      }));
    } catch (error) {
      throw error;
    }
  }
}