/**
 * AI客户端配置
 * 统一管理Google Gemini和Ollama的客户端实例
 * 提供配置验证和初始化功能
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { Ollama } from 'ollama'

/**
 * 环境变量配置接口
 */
interface EnvironmentConfig {
  /** Google Gemini API密钥 */
  GOOGLE_GEMINI_API_KEY?: string
  /** Ollama服务主机地址 */
  OLLAMA_HOST?: string
  /** Node.js环境 */
  NODE_ENV?: string
}

/**
 * AI客户端配置类
 * 负责管理和初始化AI服务客户端
 */
class AIClientsConfig {
  private env: EnvironmentConfig
  private _genAI: GoogleGenerativeAI | null = null
  private _ollama: Ollama | null = null

  constructor() {
    this.env = {
      GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
      OLLAMA_HOST: process.env.OLLAMA_HOST || 'http://localhost:11434',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  }

  /**
   * 获取Google Gemini AI客户端实例
   * @returns GoogleGenerativeAI实例
   */
  get genAI(): GoogleGenerativeAI {
    if (!this._genAI) {
      if (!this.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('未配置 GOOGLE_GEMINI_API_KEY 环境变量')
      }
      this._genAI = new GoogleGenerativeAI(this.env.GOOGLE_GEMINI_API_KEY)
    }
    return this._genAI
  }

  /**
   * 获取Ollama客户端实例
   * @returns Ollama实例
   */
  get ollama(): Ollama {
    if (!this._ollama) {
      this._ollama = new Ollama({ 
        host: this.env.OLLAMA_HOST 
      })
    }
    return this._ollama
  }

  /**
   * 检查Gemini配置是否有效
   * @returns 是否配置有效
   */
  isGeminiConfigured(): boolean {
    return !!this.env.GOOGLE_GEMINI_API_KEY
  }

  /**
   * 检查Ollama配置是否有效
   * @returns 是否配置有效
   */
  isOllamaConfigured(): boolean {
    return !!this.env.OLLAMA_HOST
  }

  /**
   * 获取当前环境信息
   * @returns 环境配置对象
   */
  getEnvironmentInfo() {
    return {
      node_env: this.env.NODE_ENV,
      gemini_configured: this.isGeminiConfigured(),
      ollama_configured: this.isOllamaConfigured(),
      ollama_host: this.env.OLLAMA_HOST
    }
  }

  /**
   * 验证所有配置
   * @returns 配置验证结果
   */
  validateConfigurations() {
    const issues: string[] = []

    if (!this.isGeminiConfigured()) {
      issues.push('未配置 Google Gemini API 密钥')
    }

    if (!this.isOllamaConfigured()) {
      issues.push('未配置 Ollama 服务地址')
    }

    return {
      isValid: issues.length === 0,
      issues,
      summary: {
        gemini: this.isGeminiConfigured(),
        ollama: this.isOllamaConfigured()
      }
    }
  }
}

// 导出单例实例
export const aiClients = new AIClientsConfig()

// 导出客户端类用于测试
export { AIClientsConfig } 