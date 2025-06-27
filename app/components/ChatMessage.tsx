/**
 * 聊天消息组件
 * 显示单条聊天消息，支持用户和AI消息的不同样式
 * 包含复制消息和模型信息显示功能
 */

import React from 'react'
import { Copy, User, Bot, CheckCircle } from 'lucide-react'
import { formatTimestamp, getModelIcon, copyToClipboard } from '../utils'
import type { Message } from '../types'

/**
 * 聊天消息组件属性接口
 */
interface ChatMessageProps {
  /** 消息对象 */
  message: Message
  /** 是否显示复制成功的提示 */
  showCopySuccess?: boolean
  /** 复制消息的回调函数 */
  onCopy?: (content: string) => void
}

/**
 * 聊天消息组件
 * 
 * 根据消息角色（用户/AI）显示不同的样式：
 * - 用户消息：右对齐，蓝色背景
 * - AI消息：左对齐，白色背景，显示模型信息
 * 
 * @param props 组件属性
 * @returns JSX元素
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showCopySuccess = false,
  onCopy
}) => {
  /**
   * 处理复制消息
   */
  const handleCopy = async () => {
    const success = await copyToClipboard(message.content)
    if (success && onCopy) {
      onCopy(message.content)
    }
  }

  return (
    <div className={`flex gap-4 p-4 group ${
      message.role === 'user' ? 'justify-end' : 'justify-start'
    }`}>
      {/* AI消息的头像 */}
      {message.role === 'assistant' && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      {/* 消息内容容器 */}
      <div className={`max-w-[70%] ${
        message.role === 'user' ? 'order-1' : 'order-2'
      }`}>
        {/* 消息气泡 */}
        <div className={`chat-bubble ${
          message.role === 'user' 
            ? 'chat-bubble-user' 
            : 'chat-bubble-ai'
        }`}>
          {/* 消息内容 */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {/* AI消息的模型信息 */}
          {message.role === 'assistant' && message.modelInfo && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span>{getModelIcon(message.modelInfo.provider)}</span>
                <span>
                  {message.modelInfo.provider === 'gemini' ? 'Gemini' : 'Ollama'} · {message.modelInfo.model}
                </span>
              </span>
            </div>
          )}

          {/* 操作按钮区域 */}
          <div className={`mt-2 flex items-center gap-2 text-xs ${
            message.role === 'user' 
              ? 'text-blue-100' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {/* 时间戳 */}
            <span>{formatTimestamp(message.timestamp)}</span>
            
            {/* 复制按钮 */}
            <button
              onClick={handleCopy}
              className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${
                message.role === 'user' 
                  ? 'hover:bg-white/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="复制消息"
            >
              {showCopySuccess ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 用户消息的头像 */}
      {message.role === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full flex items-center justify-center order-2">
          <User className="w-5 h-5 text-white dark:text-gray-800" />
        </div>
      )}
    </div>
  )
}

export default ChatMessage 