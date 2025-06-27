/**
 * 多模型AI聊天应用的类型定义
 * 包含消息、对话、模型等相关接口定义
 */

/**
 * 消息接口
 * 表示聊天中的单条消息
 */
export interface Message {
  /** 消息唯一标识符 */
  id: string
  /** 消息角色：用户或AI助手 */
  role: 'user' | 'assistant'
  /** 消息内容文本 */
  content: string
  /** 消息创建时间戳 */
  timestamp: Date
  /** 可选：生成该消息的模型信息 */
  modelInfo?: {
    /** 模型提供商 */
    provider: string
    /** 模型名称 */
    model: string
  }
}

/**
 * 对话接口
 * 表示一个完整的对话会话
 */
export interface Conversation {
  /** 对话唯一标识符 */
  id: string
  /** 对话标题（通常根据首条消息生成） */
  title: string
  /** 对话中的所有消息列表 */
  messages: Message[]
  /** 对话创建时间 */
  createdAt: Date
  /** 可选：该对话使用的模型提供商 */
  modelProvider?: string
  /** 可选：该对话使用的具体模型名称 */
  modelName?: string
}

/**
 * 模型信息接口
 * 表示AI模型的状态和可用性信息
 */
export interface ModelInfo {
  /** Gemini模型信息 */
  gemini: {
    /** 是否可用 */
    available: boolean
    /** 可用的模型列表 */
    models: string[]
  }
  /** Ollama模型信息 */
  ollama: {
    /** 是否可用 */
    available: boolean
    /** 可用的模型列表 */
    models: string[]
  }
}

/**
 * 聊天请求接口
 * API请求的数据结构
 */
export interface ChatRequest {
  /** 用户输入的消息内容 */
  message: string
  /** 对话会话ID */
  conversation_id: string
  /** 历史消息记录 */
  history: Message[]
  /** 模型提供商：gemini 或 ollama */
  model_provider: 'gemini' | 'ollama'
  /** 可选：指定的模型名称 */
  model_name?: string
  /** 可选：模型配置参数 */
  model_config?: {
    /** 温度参数，控制生成的随机性 */
    temperature?: number
    /** 最大生成令牌数 */
    max_tokens?: number
    /** Top-p 参数 */
    top_p?: number
    /** Top-k 参数 */
    top_k?: number
  }
}

/**
 * 聊天响应接口
 * API响应的数据结构
 */
export interface ChatResponse {
  /** AI生成的回复消息 */
  message: string
  /** 请求是否成功 */
  success: boolean
  /** 可选：生成回复的模型信息 */
  model_info?: {
    /** 模型提供商 */
    provider: string
    /** 模型名称 */
    model: string
  }
  /** 可选：错误信息 */
  error?: string
  /** 可选：错误详情（开发环境） */
  details?: string
}

/**
 * 模型提供商类型
 * 支持的AI模型提供商
 */
export type ModelProvider = 'gemini' | 'ollama'

/**
 * 主题模式类型
 * 应用的主题模式
 */
export type ThemeMode = 'light' | 'dark'

/**
 * 组件属性接口
 * 常用的组件属性定义
 */
export interface ComponentProps {
  /** 可选的CSS类名 */
  className?: string
  /** 可选的子元素 */
  children?: React.ReactNode
}

/**
 * 消息状态枚举
 * 消息的发送状态
 */
export enum MessageStatus {
  /** 发送中 */
  SENDING = 'sending',
  /** 发送成功 */
  SUCCESS = 'success',
  /** 发送失败 */
  FAILED = 'failed',
  /** 等待发送 */
  PENDING = 'pending'
}

/**
 * 模型状态枚举
 * 模型的连接状态
 */
export enum ModelStatus {
  /** 已连接 */
  CONNECTED = 'connected',
  /** 连接中 */
  CONNECTING = 'connecting',
  /** 已断开 */
  DISCONNECTED = 'disconnected',
  /** 连接错误 */
  ERROR = 'error'
} 