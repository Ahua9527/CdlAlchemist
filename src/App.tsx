import ALEUploader from './components/ALEUploader'
import PWAUpdatePrompt from './components/PWAUpdatePrompt'
import { ThemeProvider } from './context/ThemeContext'

/**
 * 应用程序主组件
 * 
 * 这是应用程序的入口点，由三个主要部分组成：
 * 1. ThemeProvider - 提供深色/浅色主题上下文
 * 2. ALEUploader - 主要的文件上传和转换界面
 * 3. PWAUpdatePrompt - 当PWA有新版本时显示更新提示
 * 
 * 整个应用程序被包裹在ThemeProvider中，以便全局管理主题状态
 */
function App() {
  return (
    <ThemeProvider>
      {/* 主界面容器，带有响应式深色/浅色主题背景 */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* ALE文件上传和处理组件 */}
        <ALEUploader />
        {/* PWA更新提示组件，当有新版本时显示 */}
        <PWAUpdatePrompt />
      </div>
    </ThemeProvider>
  )
}

export default App