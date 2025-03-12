/**
 * 导入 path 模块的 resolve 函数
 * 用于解析路径，确保在不同操作系统中路径正确
 */
import { resolve } from 'path';

/**
 * Tailwind CSS 配置
 * 
 * 该文件配置 Tailwind CSS 的行为和样式
 * 包括内容扫描路径、暗黑模式设置和主题扩展
 */
export default {
  /**
   * 内容配置
   * 指定需要扫描的文件路径，以查找和处理 Tailwind 类名
   * 包括 HTML 文件和所有 JavaScript/TypeScript 组件文件
   */
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  /**
   * 暗黑模式配置
   * 使用 class 策略，通过添加 .dark 类切换暗黑模式
   * 而不是使用媒体查询的 'media' 策略
   */
  darkMode: 'class',
  
  /**
   * 主题配置
   * 自定义 Tailwind 的默认样式
   */
  theme: {
    extend: {
      /**
       * 自定义阴影
       * 添加名为 'custom' 的阴影样式
       */
      boxShadow: {
        'custom': '0 8px 32px rgba(0,0,0,0.12)',
      },
      
      /**
       * 自定义颜色
       * 定义项目使用的特定颜色
       * 包括应用程序特定颜色、亮色主题和暗色主题颜色
       */
      colors: {
        selected: '#3366FF',
        resolve: '#41AF45',
        light: {
          'bg': '#F1F1F1',
          'card': '#F9F9F9',
          'input': '#F4F4F4',
          'placeholder': '#0D0D0D',
          'titlebar': '#F9F9F9',
        },
        dark: {
          'bg': '#212121',
          'card': '#171717',
          'input': '#2F2F2F',
          'placeholder': '#ECECEC',
          'titlebar': '#171717',
        }
      },
      
      /**
       * 自定义字体
       * 定义字体系列，提供从优先到备选的顺序
       * 使用特殊手写风格字体 Chalkboard SE 和备选字体
       */
      fontFamily: {
        chalkboard: ['"Chalkboard SE"', '"Comic Sans MS"', 'cursive'],
      },
    },
  },
  
  /**
   * 插件配置
   * 可以添加 Tailwind 插件，目前为空
   */
  plugins: [],
}