import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
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
      workbox: {
        // 启用 SW 立即接管网页
        skipWaiting: true,
        clientsClaim: true,
        
        // 静态资源缓存模式 - 扩展匹配模式以包含所有静态资源
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2,jpg,jpeg,gif,json,webp}'
        ],
        
        // 运行时缓存策略
        runtimeCaching: [
          {
            // CDN 资源缓存策略
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
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
  
  // 构建优化配置
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets'
    }
  },
  
  // 开发服务器配置
  server: {
    // HTTPS 配置
    https: {
      key: fs.readFileSync('localhost-key.pem'),
      cert: fs.readFileSync('localhost.pem'),
    },
    
    // 安全头配置 - 简化为静态网站所需
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'"
      ].join('; '),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})