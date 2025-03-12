/**
 * PostCSS 配置文件
 * 
 * 该文件定义了项目使用的 PostCSS 插件
 * PostCSS 是一个用 JavaScript 转换 CSS 的工具
 */

export default {
  plugins: {
    /**
     * tailwindcss 插件
     * 处理 Tailwind CSS 的类名转换为实际 CSS
     * 根据 tailwind.config.js 的配置生成对应的样式
     */
    tailwindcss: {},

    /**
     * autoprefixer 插件
     * 自动为 CSS 规则添加厂商前缀
     * 确保 CSS 在不同浏览器中的兼容性
     * 例如:将 display: flex 转换为 -webkit-display: flex 等
     */
    autoprefixer: {},
  },
}