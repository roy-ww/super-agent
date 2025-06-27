/**
 * 通用工具函数
 * 包含日期格式化、字符串处理、模型相关等工具函数
 */

import { v4 as uuidv4 } from 'uuid'
import { MODEL_CONFIG } from '../constants'
import type { ModelProvider } from '../types'

/**
 * 生成唯一ID
 * @returns 返回UUID字符串
 */
export const generateId = (): string => {
  return uuidv4()
}

/**
 * 格式化时间戳
 * @param timestamp 时间戳或Date对象
 * @param options 格式化选项
 * @returns 格式化后的时间字符串
 */
export const formatTimestamp = (
  timestamp: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  }
): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', options)
}

/**
 * 格式化日期
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @param suffix 省略号后缀
 * @returns 截断后的文本
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + suffix
}

/**
 * 获取模型图标
 * @param provider 模型提供商
 * @returns 模型对应的图标
 */
export const getModelIcon = (provider: string): string => {
  switch (provider) {
    case 'gemini':
      return MODEL_CONFIG.GEMINI.ICON
    case 'ollama':
      return MODEL_CONFIG.OLLAMA.ICON
    default:
      return '🤖'
  }
}

/**
 * 获取模型显示名称
 * @param provider 模型提供商
 * @returns 模型显示名称
 */
export const getModelDisplayName = (provider: string): string => {
  switch (provider) {
    case 'gemini':
      return MODEL_CONFIG.GEMINI.DISPLAY_NAME
    case 'ollama':
      return MODEL_CONFIG.OLLAMA.DISPLAY_NAME
    default:
      return '未知模型'
  }
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 复制是否成功
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 降级方案：使用传统的document.execCommand
    try {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    } catch (fallbackError) {
      console.error('复制到剪贴板失败:', fallbackError)
      return false
    }
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * 检查是否为移动设备
 * @returns 是否为移动设备
 */
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * 检查是否为暗色主题
 * @returns 是否为暗色主题
 */
export const isDarkMode = (): boolean => {
  return document.documentElement.classList.contains('dark')
}

/**
 * 切换主题模式
 */
export const toggleTheme = (): void => {
  document.documentElement.classList.toggle('dark')
}

/**
 * 滚动到元素位置
 * @param element 目标元素
 * @param behavior 滚动行为
 */
export const scrollToElement = (
  element: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth'
): void => {
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

/**
 * 获取环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue
}

/**
 * 验证API密钥格式
 * @param apiKey API密钥
 * @returns 是否为有效格式
 */
export const validateApiKey = (apiKey: string): boolean => {
  // 简单的API密钥格式验证
  return apiKey.length > 10 && /^[A-Za-z0-9_-]+$/.test(apiKey)
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 延迟执行
 * @param ms 延迟毫秒数
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 获取随机颜色
 * @returns 随机十六进制颜色值
 */
export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * 检查对象是否为空
 * @param obj 要检查的对象
 * @returns 是否为空对象
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0
}

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
} 