import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const PWAUpdatePrompt = () => {
  const [needRefresh, setNeedRefresh] = useState(false)

  useEffect(() => {
    const handler = (event: Event) => {
      if ('newServiceWorker' in event && event instanceof CustomEvent) {
        setNeedRefresh(true)
      }
    }

    window.addEventListener('pwa-update-available', handler)
    return () => window.removeEventListener('pwa-update-available', handler)
  }, [])

  const updateApp = () => {
    const event = new Event('pwa-update-accepted')
    window.dispatchEvent(event)
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 
                    rounded-lg shadow-lg p-4 flex items-center justify-between gap-4 z-50
                    border border-gray-200 dark:border-gray-700 max-w-sm w-11/12">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        新版本可用，是否更新？
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={updateApp}
          className="px-3 py-1 bg-selected text-white rounded-md text-sm hover:bg-blue-600 
                     transition-colors duration-200"
        >
          更新
        </button>
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