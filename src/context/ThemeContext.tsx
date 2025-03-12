import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * 主题类型定义，只允许'light'或'dark'两种值
 */
type Theme = 'light' | 'dark';

/**
 * 主题上下文接口定义，包含当前主题状态
 */
type ThemeContext = { theme: Theme };

/**
 * 创建主题上下文
 * 初始值为undefined，确保使用时必须通过Provider提供值
 */
const ThemeContext = createContext<ThemeContext | undefined>(undefined);

/**
 * 主题提供者组件
 * 
 * 负责：
 * 1. 管理应用的主题状态(深色/浅色)
 * 2. 根据系统偏好自动切换主题
 * 3. 在文档根元素上设置相应的类名
 * 
 * @param {React.ReactNode} children - 子组件
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 主题状态，默认为浅色
  const [theme, setTheme] = useState<Theme>('light');

  /**
   * 监听系统颜色主题偏好变化
   * 在组件挂载和系统主题变化时更新应用主题
   */
  useEffect(() => {
    // 获取系统颜色主题偏好
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    /**
     * 更新主题函数
     * 根据系统偏好设置应用主题
     */
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      updateDocumentClass(newTheme);
    };

    // 初始化时应用当前系统主题
    updateTheme(mediaQuery);

    // 添加主题变化监听器
    mediaQuery.addEventListener('change', updateTheme);
    // 组件卸载时移除监听器
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, []);

  /**
   * 更新文档类名
   * 在html元素上添加或移除'dark'类，以应用对应的主题样式
   * 
   * @param {Theme} newTheme - 要应用的主题
   */
  const updateDocumentClass = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 主题钩子函数
 * 
 * 便捷访问主题上下文的自定义Hook
 * 在组件中使用此Hook可以读取当前主题状态
 * 
 * @returns {ThemeContext} 主题上下文值
 * @throws {Error} 如果在ThemeProvider外部使用，抛出错误
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}