/**
 * 多模型AI聊天API路由处理器
 * 支持Google Gemini和Ollama两种AI模型
 * 提供统一的聊天接口和模型管理功能
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { Ollama } from 'ollama'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 消息接口定义
 * 表示聊天中的单条消息
 */
interface Message {
  /** 消息角色：用户或AI助手 */
  role: 'user' | 'assistant'
  /** 消息内容 */
  content: string
}

/**
 * 聊天请求接口定义
 * 包含所有聊天API需要的参数
 */
interface ChatRequest {
  /** 用户输入的消息 */
  message: string
  /** 对话会话ID */
  conversation_id: string
  /** 历史消息记录 */
  history: Message[]
  /** 模型提供商：gemini或ollama */
  model_provider: 'gemini' | 'ollama'
  /** 可选：指定的模型名称 */
  model_name?: string
  /** 可选：模型配置参数 */
  model_config?: {
    /** 温度参数，控制生成的随机性 (0-1) */
    temperature?: number
    /** 最大生成令牌数 */
    max_tokens?: number
    /** Top-p 采样参数 (0-1) */
    top_p?: number
    /** Top-k 采样参数 */
    top_k?: number
  }
}

/**
 * 初始化AI服务实例
 * 从环境变量读取配置信息
 */
// Google Gemini AI实例
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')
// Ollama实例，支持本地部署
const ollama = new Ollama({ 
  host: process.env.OLLAMA_HOST || 'http://localhost:11434' 
})

/**
 * Gemini模型聊天处理函数
 * 处理使用Google Gemini模型的聊天请求
 * @param request 聊天请求对象
 * @returns 生成的回复文本
 */
async function handleGeminiChat(request: ChatRequest) {
  // 检查API密钥是否配置
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    throw new Error('未配置 Gemini API 密钥，请在 .env.local 文件中添加 GOOGLE_GEMINI_API_KEY')
  }

  const { message, history, model_config } = request
  // 使用指定模型或默认模型
  const modelName = request.model_name || 'gemini-1.5-flash'

  // 创建Gemini模型实例，配置生成参数
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: model_config?.temperature || 0.7,    // 生成随机性
      topK: model_config?.top_k || 40,                  // Top-K采样
      topP: model_config?.top_p || 0.95,                // Top-P采样
      maxOutputTokens: model_config?.max_tokens || 2048, // 最大输出长度
    },
  })

  // 转换历史消息格式以适配Gemini API
  const chatHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user', // Gemini使用'model'而不是'assistant'
    parts: [{ text: msg.content }]
  }))

  // 创建聊天会话，包含历史记录
  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      temperature: model_config?.temperature || 0.7,
      topK: model_config?.top_k || 40,
      topP: model_config?.top_p || 0.95,
      maxOutputTokens: model_config?.max_tokens || 2048,
    },
  })

  // 发送消息并获取回复
  const result = await chat.sendMessage(message)
  const response = await result.response
  return response.text()
}

/**
 * Ollama模型聊天处理函数
 * 处理使用本地Ollama模型的聊天请求
 * @param request 聊天请求对象
 * @returns 生成的回复文本
 */
async function handleOllamaChat(request: ChatRequest) {
  const { message, history, model_config } = request
  // 使用指定模型或默认模型
  const modelName = request.model_name || 'llama2'

  // 检查Ollama服务连接状态
  try {
    await ollama.list()
  } catch (error) {
    throw new Error('无法连接到Ollama服务，请确保Ollama已启动并运行在 ' + (process.env.OLLAMA_HOST || 'http://localhost:11434'))
  }

  // 构建消息历史，包含新的用户消息
  const messages = [
    ...history.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user' as const,
      content: message
    }
  ]

  // 调用Ollama聊天API
  const response = await ollama.chat({
    model: modelName,
    messages: messages,
    options: {
      temperature: model_config?.temperature || 0.7, // 生成随机性
      top_p: model_config?.top_p || 0.95,            // Top-P采样
      top_k: model_config?.top_k || 40,              // Top-K采样
    }
  })

  return response.message.content
}

/**
 * POST请求处理器
 * 处理聊天消息发送请求
 * @param request Next.js请求对象
 * @returns JSON响应
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: ChatRequest = await request.json()
    const { message, model_provider } = body

    // 验证消息内容
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息内容不能为空' },
        { status: 400 }
      )
    }

    // 验证模型提供商
    if (!model_provider || !['gemini', 'ollama'].includes(model_provider)) {
      return NextResponse.json(
        { error: '必须指定有效的模型提供商（gemini 或 ollama）' },
        { status: 400 }
      )
    }

    let responseText: string
    let modelInfo: any = {}

    // 根据模型提供商分发请求
    if (model_provider === 'gemini') {
      responseText = await handleGeminiChat(body)
      modelInfo = {
        provider: 'gemini',
        model: body.model_name || 'gemini-1.5-flash'
      }
    } else if (model_provider === 'ollama') {
      responseText = await handleOllamaChat(body)
      modelInfo = {
        provider: 'ollama',
        model: body.model_name || 'llama2'
      }
    } else {
      throw new Error('不支持的模型提供商')
    }

    // 返回成功响应
    return NextResponse.json({
      message: responseText,
      success: true,
      model_info: modelInfo
    })

  } catch (error: any) {
    console.error('AI API 错误:', error)
    
    // 根据错误类型返回相应的错误信息
    let errorMessage = '处理请求时发生错误，请稍后重试'
    
    // API密钥相关错误
    if (error?.message?.includes('API key')) {
      errorMessage = 'API密钥无效，请检查配置'
    } 
    // 配额限制错误
    else if (error?.message?.includes('quota')) {
      errorMessage = 'API调用配额已用完，请稍后重试'
    } 
    // 频率限制错误
    else if (error?.message?.includes('rate limit')) {
      errorMessage = '请求过于频繁，请稍后重试'
    } 
    // 内容安全过滤错误
    else if (error?.message?.includes('safety')) {
      errorMessage = '内容被安全过滤器拦截，请调整您的问题'
    } 
    // 地区限制错误
    else if (error?.message?.includes('User location is not supported')) {
      errorMessage = 'Gemini API在当前地区不可用，请尝试使用VPN或联系管理员'
    } 
    // 模型不存在错误
    else if (error?.message?.includes('models/gemini') && error?.message?.includes('not found')) {
      errorMessage = '模型不可用，请检查模型名称或稍后重试'
    } 
    // Ollama连接错误
    else if (error?.message?.includes('无法连接到Ollama')) {
      errorMessage = error.message
    } 
    // Gemini配置错误
    else if (error?.message?.includes('未配置 Gemini API')) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        // 开发环境下返回详细错误信息
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * GET请求处理器
 * 获取可用模型列表和状态信息
 * @returns 模型可用性信息
 */
export async function GET() {
  try {
    // 初始化模型信息对象
    const models = {
      gemini: {
        available: !!process.env.GOOGLE_GEMINI_API_KEY, // 检查API密钥是否配置
        models: ['gemini-1.5-flash', 'gemini-1.5-pro'] // Gemini可用模型列表
      },
      ollama: {
        available: false,
        models: [] as string[]
      }
    }

    // 检查Ollama服务可用性
    try {
      const ollamaModels = await ollama.list()
      models.ollama.available = true
      models.ollama.models = ollamaModels.models.map((model: any) => model.name)
    } catch (error) {
      console.log('Ollama服务不可用:', error)
      // Ollama不可用时保持默认值
    }

    return NextResponse.json({
      available_models: models,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('获取模型列表错误:', error)
    
    return NextResponse.json(
      { error: '获取模型列表失败，请稍后重试' },
      { status: 500 }
    )
  }
} 