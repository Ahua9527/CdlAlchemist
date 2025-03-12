import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * PWA更新提示组件
 * 
 * 当Progressive Web App(PWA)有新版本可用时，显示更新提示
 * 用户可以选择立即更新或忽略更新通知
 */
const PWAUpdatePrompt = () => {
  // 状态控制是否需要显示更新提示
  const [needRefresh, setNeedRefresh] = useState(false)

  /**
   * 监听PWA更新事件
   * 当检测到新版本时，显示更新提示
   */
  useEffect(() => {
    // 定义事件处理函数，监听pwa-update-available自定义事件
    const handler = (event: Event) => {
      if ('newServiceWorker' in event && event instanceof CustomEvent) {
        setNeedRefresh(true)
      }
    }

    // 添加事件监听
    window.addEventListener('pwa-update-available', handler)
    // 清理函数，移除事件监听
    return () => window.removeEventListener('pwa-update-available', handler)
  }, [])

  /**
   * 更新应用程序
   * 触发pwa-update-accepted事件，通知service worker更新应用
   */
  const updateApp = () => {
    const event = new Event('pwa-update-accepted')
    window.dispatchEvent(event)
    setNeedRefresh(false)
  }

  // 如果不需要显示更新提示，则不渲染任何内容
  if (!needRefresh) return null

  return (
    // 更新提示弹窗，固定在页面底部
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 
                    rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 z-50
                    border border-gray-200 dark:border-gray-700 max-w-sm w-11/12">
      {/* 提示文本 */}
      <p className="text-sm text-gray-700 dark:text-gray-300">
        新版本可用，是否更新？
      </p>
      {/* 操作按钮区域 */}
      <div className="flex items-center gap-2">
        {/* 更新按钮 */}
        <button
          onClick={updateApp}
          className="px-3 py-1 bg-selected text-white rounded-md text-sm hover:bg-blue-600 
                     transition-colors duration-200"
        >
          更新
        </button>
        {/* 关闭提示按钮 */}
        <button
          onClick={() => setNeedRefresh(false)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full 
                     transition-colors duration-200"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export default PWAUpdatePrompt