/**
 * ESLint 配置文件
 * 
 * 该文件定义了项目的代码检查规则
 * 使用新的 ESLint 扁平配置格式
 */

/**
 * 导入 JavaScript ESLint 规则集
 * 提供 JavaScript 代码的基础检查规则
 */
import js from '@eslint/js'

/**
 * 导入全局变量定义
 * 包含浏览器、Node.js 等环境的全局变量
 */
import globals from 'globals'

/**
 * 导入 React Hooks 规则插件
 * 检查 React Hooks 的使用是否符合规则
 */
import reactHooks from 'eslint-plugin-react-hooks'

/**
 * 导入 React Refresh 规则插件
 * 用于支持 React Fast Refresh 功能
 */
import reactRefresh from 'eslint-plugin-react-refresh'

/**
 * 导入 TypeScript ESLint 配置
 * 提供 TypeScript 代码的检查规则
 */
import tseslint from 'typescript-eslint'

/**
 * 导出 ESLint 配置
 * 使用 tseslint.config 包装多个配置对象
 */
export default tseslint.config(
  /**
   * 忽略配置
   * 排除 dist 目录中的文件不进行检查
   */
  { ignores: ['dist'] },
  
  {
    /**
     * 扩展基础配置
     * 包含 JS 推荐配置和 TypeScript 推荐配置
     */
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    
    /**
     * 适用文件
     * 此配置仅适用于 .ts 和 .tsx 文件
     */
    files: ['**/*.{ts,tsx}'],
    
    /**
     * 语言选项
     * 设置 ECMAScript 版本和全局变量
     */
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    
    /**
     * 插件配置
     * 注册 React Hooks 和 React Refresh 插件
     */
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    
    /**
     * 规则配置
     * 合并 React Hooks 推荐规则
     * 设置 React Refresh 组件导出规则，允许常量导出
     */
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)