/**
 * 主页面组件
 * 多模型AI聊天应用的主界面
 * 集成聊天功能、模型选择、主题切换等核心功能
 */

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Moon, 
  Sun, 
  MessageSquare, 
  Trash2, 
  Settings,
  Plus,
  X
} from 'lucide-react'

// 导入新的模块化组件和工具
import ChatMessage from './components/ChatMessage'
import ModelSelector from './components/ModelSelector'
import { useTheme } from './hooks/useTheme'
import { useModels } from './hooks/useModels'
import { generateId, formatTimestamp, scrollToElement, debounce } from './utils'
import { API_ENDPOINTS, UI_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES } from './constants'
import type { Message, Conversation, ChatRequest, ChatResponse } from './types'

/**
 * 主页面组件
 * 
 * 功能包括：
 * - 多对话管理
 * - AI模型切换
 * - 实时聊天
 * - 主题切换
 * - 消息历史记录
 * 
 * @returns JSX元素
 */
export default function Home() {
  // ======================== 状态管理 ========================
  
  // 对话相关状态
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // UI状态
  const [showSettings, setShowSettings] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  
  // 使用自定义Hook管理主题和模型
  const { isDarkMode, toggleTheme } = useTheme()
  const {
    selectedProvider,
    selectedModel,
    modelInfo,
    isCheckingModels,
    switchProvider,
    switchModel,
    checkAvailableModels,
    isCurrentModelAvailable
  } = useModels()

  // ======================== 引用和副作用 ========================
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currentConversation = conversations.find(c => c.id === currentConversationId)

  // 自动滚动到底部
  useEffect(() => {
    if (currentConversation?.messages.length) {
      setTimeout(() => {
        scrollToElement(messagesEndRef.current)
      }, UI_CONFIG.AUTO_SCROLL_DELAY)
    }
  }, [currentConversation?.messages])

  // 防抖处理消息输入
  const debouncedSetMessage = debounce((value: string) => {
    setMessage(value)
  }, 300)

  // ======================== 对话管理功能 ========================

  /**
   * 创建新对话
   */
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: new Date(),
      modelProvider: selectedProvider,
      modelName: selectedModel
    }
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    
    // 聚焦到输入框
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  /**
   * 删除对话
   * @param conversationId 对话ID
   */
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
    }
  }

  /**
   * 更新对话标题
   * @param conversationId 对话ID
   * @param firstMessage 首条消息内容
   */
  const updateConversationTitle = (conversationId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '')
    setConversations(prev => 
      prev.map(c => 
        c.id === conversationId ? { ...c, title } : c
      )
    )
  }

  // ======================== 消息处理功能 ========================

  /**
   * 发送消息
   */
  const sendMessage = async () => {
    // 基础验证
    if (!message.trim() || isLoading) return
    
    // 检查当前模型是否可用
    if (!isCurrentModelAvailable()) {
      alert(ERROR_MESSAGES.MODEL_UNAVAILABLE)
      return
    }

    let conversationId = currentConversationId
    
    // 如果没有当前对话，创建新对话
    if (!conversationId) {
      const newConversation: Conversation = {
        id: generateId(),
        title: message.slice(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date(),
        modelProvider: selectedProvider,
        modelName: selectedModel
      }
      setConversations(prev => [newConversation, ...prev])
      conversationId = newConversation.id
      setCurrentConversationId(conversationId)
    }

    // 创建用户消息
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    // 添加用户消息到对话
    setConversations(prev => 
      prev.map(c => 
        c.id === conversationId 
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      )
    )

    // 如果是第一条消息，更新对话标题
    const conversation = conversations.find(c => c.id === conversationId)
    if (!conversation || conversation.messages.length === 0) {
      updateConversationTitle(conversationId, message.trim())
    }

    // 清空输入框并设置加载状态
    const currentMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    try {
      // 构建API请求
      const requestBody: ChatRequest = {
        message: currentMessage,
        conversation_id: conversationId,
        history: conversation?.messages || [],
        model_provider: selectedProvider,
        model_name: selectedModel
      }

      // 发送API请求
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()

      if (data.success && data.message) {
        // 创建AI回复消息
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          modelInfo: data.model_info
        }

        // 添加AI回复到对话
        setConversations(prev => 
          prev.map(c => 
            c.id === conversationId 
              ? { ...c, messages: [...c.messages, assistantMessage] }
              : c
          )
        )
      } else {
        throw new Error(data.error || ERROR_MESSAGES.UNKNOWN_ERROR)
      }

    } catch (error: any) {
      console.error('发送消息失败:', error)
      
      // 创建错误消息
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `抱歉，发送消息时出现错误：${error.message || ERROR_MESSAGES.UNKNOWN_ERROR}`,
        timestamp: new Date()
      }

      // 添加错误消息到对话
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, messages: [...c.messages, errorMessage] }
            : c
        )
      )
    } finally {
      setIsLoading(false)
      // 重新聚焦到输入框
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }

  /**
   * 处理键盘事件
   * @param e 键盘事件
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  /**
   * 复制消息内容
   * @param content 消息内容
   */
  const copyMessage = (content: string, messageId: string) => {
    setCopiedMessageId(messageId)
    // 显示成功提示
    setTimeout(() => {
      setCopiedMessageId(null)
    }, UI_CONFIG.COPY_SUCCESS_DURATION)
  }

  // ======================== 渲染组件 ========================

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 侧边栏 */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* 侧边栏头部 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Multi-AI Chat
            </h1>
            <div className="flex items-center gap-2">
              {/* 主题切换按钮 */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* 设置按钮 */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="模型设置"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* 新建对话按钮 */}
          <button
            onClick={createNewConversation}
            className="w-full flex items-center gap-2 p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新建对话</span>
          </button>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setCurrentConversationId(conversation.id)}
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(conversation.createdAt)}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteConversation(conversation.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  title="删除对话"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>还没有对话</p>
                <p className="text-sm">点击"新建对话"开始聊天</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {currentConversation.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    showCopySuccess={copiedMessageId === msg.id}
                    onCopy={(content) => copyMessage(content, msg.id)}
                  />
                ))}
                
                {/* 加载指示器 */}
                {isLoading && (
                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="chat-bubble chat-bubble-ai">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="max-w-4xl mx-auto p-4">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                    className="message-input"
                    rows={3}
                    disabled={isLoading || !isCurrentModelAvailable()}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || isLoading || !isCurrentModelAvailable()}
                    className="absolute right-3 bottom-3 p-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="发送消息"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                
                {/* 当前模型显示 */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>当前模型:</span>
                  <span className="flex items-center gap-1">
                    {selectedProvider === 'gemini' ? '🤖' : '🦙'}
                    {selectedProvider === 'gemini' ? 'Gemini' : 'Ollama'} · {selectedModel}
                  </span>
                  {!isCurrentModelAvailable() && (
                    <span className="text-red-500">(不可用)</span>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          /* 欢迎界面 */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                欢迎使用 Multi-AI Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                支持多种AI模型的智能对话应用
              </p>
              <button
                onClick={createNewConversation}
                className="btn-primary"
              >
                开始新对话
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                设置
              </h2>
                             <button
                 onClick={() => setShowSettings(false)}
                 className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                 title="关闭设置"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-4">
              <ModelSelector
                selectedProvider={selectedProvider}
                selectedModel={selectedModel}
                modelInfo={modelInfo}
                isCheckingModels={isCheckingModels}
                onProviderChange={switchProvider}
                onModelChange={switchModel}
                onRefresh={checkAvailableModels}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 