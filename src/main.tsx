import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

/**
 * 应用程序入口点
 * 
 * 这个文件是React应用的入口，负责：
 * 1. 导入必要的样式和组件
 * 2. 使用React.StrictMode包裹App组件，以启用额外的开发检查
 * 3. 将App组件渲染到DOM中的'root'元素
 * 4. 添加'loaded'类，可能用于初始加载动画或过渡效果
 */

// 创建React根元素并渲染App组件
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// 为root元素添加'loaded'类，可能用于控制初始加载状态或动画
document.getElementById('root')?.classList.add('loaded')