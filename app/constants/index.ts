/**
 * 应用常量定义
 * 包含API端点、模型配置、UI常量等
 */

/**
 * API端点常量
 */
export const API_ENDPOINTS = {
  /** 聊天API端点 */
  CHAT: '/api/chat',
  /** 模型管理API端点 */
  MODELS: '/api/models',
} as const

/**
 * 模型配置常量
 */
export const MODEL_CONFIG = {
  /** Gemini模型配置 */
  GEMINI: {
    /** 默认模型名称 */
    DEFAULT_MODEL: 'gemini-1.5-flash',
    /** 可用模型列表 */
    AVAILABLE_MODELS: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    /** 模型图标 */
    ICON: '🤖',
    /** 显示名称 */
    DISPLAY_NAME: 'Google Gemini',
  },
  /** Ollama模型配置 */
  OLLAMA: {
    /** 默认模型名称 */
    DEFAULT_MODEL: 'llama2',
    /** 常用模型列表 */
    POPULAR_MODELS: ['llama2', 'codellama', 'mistral', 'qwq'],
    /** 模型图标 */
    ICON: '🦙',
    /** 显示名称 */
    DISPLAY_NAME: 'Ollama (本地)',
    /** 默认主机地址 */
    DEFAULT_HOST: 'http://localhost:11434',
  },
} as const

/**
 * 应用配置常量
 */
export const APP_CONFIG = {
  /** 应用名称 */
  NAME: 'Multi-AI Chat',
  /** 应用描述 */
  DESCRIPTION: '支持多种AI模型的智能对话应用',
  /** 版本号 */
  VERSION: '2.0.0',
  /** 作者 */
  AUTHOR: 'AI Assistant',
} as const

/**
 * UI配置常量
 */
export const UI_CONFIG = {
  /** 默认主题 */
  DEFAULT_THEME: 'light' as const,
  /** 侧边栏宽度 */
  SIDEBAR_WIDTH: '20rem',
  /** 最大消息长度 */
  MAX_MESSAGE_LENGTH: 4000,
  /** 自动滚动延迟 */
  AUTO_SCROLL_DELAY: 100,
  /** 消息复制成功提示时长 */
  COPY_SUCCESS_DURATION: 2000,
} as const

/**
 * 动画配置常量
 */
export const ANIMATION_CONFIG = {
  /** 页面过渡动画时长 */
  PAGE_TRANSITION: 300,
  /** 消息滑入动画时长 */
  MESSAGE_SLIDE: 200,
  /** 主题切换动画时长 */
  THEME_TRANSITION: 150,
  /** 加载动画间隔 */
  LOADING_INTERVAL: 500,
} as const

/**
 * 本地存储键名常量
 */
export const STORAGE_KEYS = {
  /** 主题模式 */
  THEME: 'theme',
  /** 对话历史 */
  CONVERSATIONS: 'conversations',
  /** 当前对话ID */
  CURRENT_CONVERSATION: 'currentConversation',
  /** 选择的模型提供商 */
  SELECTED_PROVIDER: 'selectedProvider',
  /** 选择的模型名称 */
  SELECTED_MODEL: 'selectedModel',
  /** 设置面板状态 */
  SETTINGS_OPEN: 'settingsOpen',
} as const

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  /** 网络错误 */
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  /** API密钥错误 */
  API_KEY_ERROR: 'API密钥无效，请检查配置',
  /** 模型不可用 */
  MODEL_UNAVAILABLE: '当前模型不可用，请切换其他模型',
  /** 消息为空 */
  EMPTY_MESSAGE: '消息内容不能为空',
  /** 模型连接失败 */
  MODEL_CONNECTION_FAILED: '无法连接到模型服务',
  /** 未知错误 */
  UNKNOWN_ERROR: '发生未知错误，请稍后重试',
} as const

/**
 * 成功消息常量
 */
export const SUCCESS_MESSAGES = {
  /** 消息复制成功 */
  MESSAGE_COPIED: '消息已复制到剪贴板',
  /** 对话创建成功 */
  CONVERSATION_CREATED: '新对话已创建',
  /** 对话删除成功 */
  CONVERSATION_DELETED: '对话已删除',
  /** 模型切换成功 */
  MODEL_SWITCHED: '模型切换成功',
} as const

/**
 * 键盘快捷键常量
 */
export const KEYBOARD_SHORTCUTS = {
  /** 发送消息 */
  SEND_MESSAGE: 'Enter',
  /** 换行 */
  NEW_LINE: 'Shift+Enter',
  /** 新建对话 */
  NEW_CONVERSATION: 'Ctrl+N',
  /** 切换主题 */
  TOGGLE_THEME: 'Ctrl+T',
  /** 打开设置 */
  OPEN_SETTINGS: 'Ctrl+,',
} as const

/**
 * CSS类名常量
 */
export const CSS_CLASSES = {
  /** 聊天气泡样式 */
  CHAT_BUBBLE: 'chat-bubble',
  /** 用户消息样式 */
  USER_MESSAGE: 'chat-bubble-user',
  /** AI消息样式 */
  AI_MESSAGE: 'chat-bubble-ai',
  /** 主要按钮样式 */
  PRIMARY_BUTTON: 'btn-primary',
  /** 消息输入框样式 */
  MESSAGE_INPUT: 'message-input',
  /** 加载动画样式 */
  LOADING_DOTS: 'loading-dots',
  /** 滑入动画样式 */
  SLIDE_UP: 'animate-slide-up',
  /** 滚动条样式 */
  SCROLLBAR_THIN: 'scrollbar-thin',
} as const 