/**
 * 主题管理Hook
 * 用于管理应用的主题状态（浅色/深色模式）
 */

import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../constants'
import type { ThemeMode } from '../types'

/**
 * 主题管理Hook
 * @returns 主题状态和控制函数
 */
export const useTheme = () => {
  // 主题状态
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 初始化主题
  useEffect(() => {
    // 从localStorage读取保存的主题设置
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null
    
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // 确定初始主题
    const initialDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark)
    
    setIsDarkMode(initialDarkMode)
    
    // 应用主题到DOM
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    setIsLoading(false)
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有用户手动设置时才跟随系统主题
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
      if (!savedTheme) {
        setIsDarkMode(e.matches)
        if (e.matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    
    // 清理函数
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  /**
   * 切换主题模式
   */
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    
    // 更新DOM类名
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, newDarkMode ? 'dark' : 'light')
  }

  /**
   * 设置特定主题
   * @param theme 主题模式
   */
  const setTheme = (theme: ThemeMode) => {
    const newDarkMode = theme === 'dark'
    setIsDarkMode(newDarkMode)
    
    // 更新DOM类名
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }

  /**
   * 重置为系统主题
   */
  const resetToSystemTheme = () => {
    // 清除localStorage中的主题设置
    localStorage.removeItem(STORAGE_KEYS.THEME)
    
    // 获取系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(prefersDark)
    
    // 更新DOM类名
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    /** 当前是否为深色模式 */
    isDarkMode,
    /** 当前主题模式 */
    theme: (isDarkMode ? 'dark' : 'light') as ThemeMode,
    /** 是否正在加载主题设置 */
    isLoading,
    /** 切换主题模式 */
    toggleTheme,
    /** 设置特定主题 */
    setTheme,
    /** 重置为系统主题 */
    resetToSystemTheme
  }
} 