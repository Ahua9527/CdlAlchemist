/**
 * Vite 配置文件
 * 
 * 该文件配置 Vite 构建工具的行为
 * 包括插件、构建选项、解析别名和开发服务器设置
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

export default defineConfig({
  /**
   * 插件配置
   * 添加 React 支持和 PWA 功能
   */
  plugins: [
    /**
     * React 插件
     * 提供 React 项目的 HMR (热模块替换) 和 JSX 支持
     */
    react(),
    
    /**
     * PWA (渐进式 Web 应用) 插件
     * 提供离线缓存、应用清单和服务工作者支持
     */
    VitePWA({
      /**
       * 注册类型
       * 设置为自动更新模式
       */
      registerType: 'autoUpdate',
      
      /**
       * 包含的静态资源
       * 在 PWA 打包中包含这些图标和资源
       */
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'CDLAlchemist_96_any.png', 
        'CDLAlchemist_192_any.png', 
        'CDLAlchemist_512_any.png', 
        'CDLAlchemist_96_maskable.png', 
        'CDLAlchemist_192_maskable.png', 
        'CDLAlchemist_512_maskable.png'
      ],
      
      /**
       * Web 应用程序清单
       * 定义 PWA 的元数据，如名称、图标、颜色等
       */
      manifest: {
        
        name: 'CDLAlchemist',
        short_name: 'CDLAlchemist',
        description: '从ALE到CDL，炼出色彩真金',
        theme_color: '#171717',
        background_color: '#171717',
        display: 'standalone',
        id: "/?source=pwa",
        start_url: '/?source=pwa',
        scope: '/',
        orientation: 'any',
        categories: ['productivity', 'utilities'],
        icons: [
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: 'CDLAlchemist_96_any.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'CDLAlchemist_192_any.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'CDLAlchemist_512_any.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'CDLAlchemist_96_maskable.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'CDLAlchemist_192_maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'CDLAlchemist_512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      
      /**
       * Workbox 配置
       * 配置 PWA 的服务工作者行为
       */
      workbox: {
        /**
         * 跳过等待和声明客户端
         * 允许新服务工作者立即接管而不等待旧服务工作者终止
         */
        skipWaiting: true,
        clientsClaim: true,
        
        /**
         * 全局匹配模式
         * 定义需要缓存的资源类型
         */
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,gif,json,webp}'
        ],
        
        /**
         * 运行时缓存策略
         * 定义不同资源的缓存策略
         */
        runtimeCaching: [
          {
            /**
             * CDN 缓存配置
             * 为 Cloudflare CDN 资源定义缓存策略
             */
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 一年
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  
  /**
   * 构建选项
   * 配置生产构建的优化和输出
   */
  build: {
    /**
     * 生成源映射
     * 用于生产调试
     */
    sourcemap: true,
    
    /**
     * Rollup 选项
     * 配置底层 Rollup 打包器的行为
     */
    rollupOptions: {
      output: {
        /**
         * 手动分块
         * 将 React 核心库分离到单独的 'vendor' 块中
         * 提高缓存和加载效率
         */
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    
    /**
     * 块大小警告限制
     * 设置警告阈值为 1000KB
     */
    chunkSizeWarningLimit: 1000
  },
  
  /**
   * 解析配置
   * 设置路径别名，简化导入
   */
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets'
    }
  },
  
  /**
   * 开发服务器配置
   * 设置开发环境下的服务器选项
   */
  server: {
    /**
     * HTTPS 配置
     * 使用本地证书启用 HTTPS
     */
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
    
    /**
     * HTTP 响应头配置
     * 设置安全相关的 HTTP 头
     */
    headers: {
      /**
       * 内容安全策略
       * 限制资源加载来源，提高安全性
       */
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'"
      ].join('; '),
      
      /**
       * 其他安全头
       * 防止 MIME 类型嗅探、点击劫持、XSS 攻击等
       */
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})