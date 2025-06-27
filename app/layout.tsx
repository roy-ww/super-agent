/**
 * 根布局组件
 * 定义整个应用的基础HTML结构和全局样式
 * 包含SEO元数据配置和字体设置
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// 导入全局样式文件（已移动到styles目录）
import './styles/globals.css'

/**
 * 配置Inter字体
 * 使用Google Fonts的Inter字体，支持拉丁字符集
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * 页面元数据配置
 * 定义页面的SEO信息，包括标题、描述和关键词
 */
export const metadata: Metadata = {
  title: 'Multi-AI Chat | 多模型AI对话应用',
  description: '支持Google Gemini和Ollama的多模型AI智能对话应用，提供流畅的聊天体验',
  keywords: 'AI, Gemini, Ollama, Chat, 对话, 人工智能, 多模型, 本地AI',
  authors: [{ name: 'AI Assistant' }],
  creator: 'AI Assistant',
  publisher: 'Multi-AI Chat',
  robots: 'index, follow',
  // 开放图谱标签，用于社交媒体分享
  openGraph: {
    title: 'Multi-AI Chat | 多模型AI对话应用',
    description: '支持Google Gemini和Ollama的多模型AI智能对话应用',
    type: 'website',
    locale: 'zh_CN',
  },
  // Twitter卡片配置
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-AI Chat | 多模型AI对话应用',
    description: '支持Google Gemini和Ollama的多模型AI智能对话应用',
  },
  // 视口配置
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  // 主题颜色配置
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ],
}

/**
 * 根布局组件
 * 
 * 定义应用的基础HTML结构，包括：
 * - HTML语言设置（中文）
 * - 字体应用
 * - 全局容器样式
 * - 支持深色模式的背景色
 * 
 * @param children - 子组件（页面内容）
 * @returns JSX元素
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        {/* 
          全局容器：
          - min-h-screen: 最小高度为屏幕高度
          - bg-gray-50: 浅色模式背景色
          - dark:bg-gray-900: 深色模式背景色
          - transition-colors: 主题切换时的颜色过渡动画
        */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {children}
        </div>
      </body>
    </html>
  )
} 