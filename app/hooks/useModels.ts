/**
 * AI模型管理Hook
 * 用于管理AI模型的状态、选择和可用性检查
 */

import { useState, useEffect, useCallback } from 'react'
import { API_ENDPOINTS, MODEL_CONFIG, STORAGE_KEYS } from '../constants'
import type { ModelInfo, ModelProvider } from '../types'

/**
 * 模型管理Hook
 * @returns 模型状态和管理函数
 */
export const useModels = () => {
  // 模型状态
  const [modelInfo, setModelInfo] = useState<ModelInfo>({
    gemini: { available: false, models: [] },
    ollama: { available: false, models: [] }
  })
  
  // 当前选择的模型
  const [selectedProvider, setSelectedProvider] = useState<ModelProvider>('gemini')
  const [selectedModel, setSelectedModel] = useState<string>(MODEL_CONFIG.GEMINI.DEFAULT_MODEL)
  
  // 加载和检查状态
  const [isCheckingModels, setIsCheckingModels] = useState<boolean>(false)
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  /**
   * 检查可用模型
   */
  const checkAvailableModels = useCallback(async () => {
    setIsCheckingModels(true)
    setError(null)
    
    try {
      const response = await fetch(API_ENDPOINTS.CHAT)
      if (response.ok) {
        const data = await response.json()
        if (data.available_models) {
          setModelInfo(data.available_models)
          setLastCheckTime(new Date())
          
          // 如果当前选择的提供商不可用，切换到可用的
          if (!data.available_models[selectedProvider]?.available) {
            if (data.available_models.gemini.available) {
              setSelectedProvider('gemini')
              setSelectedModel(MODEL_CONFIG.GEMINI.DEFAULT_MODEL)
            } else if (data.available_models.ollama.available && data.available_models.ollama.models.length > 0) {
              setSelectedProvider('ollama')
              setSelectedModel(data.available_models.ollama.models[0])
            }
          }
        }
      } else {
        throw new Error('获取模型信息失败')
      }
    } catch (error: any) {
      console.error('检查模型失败:', error)
      setError(error.message || '检查模型可用性失败')
    } finally {
      setIsCheckingModels(false)
    }
  }, [selectedProvider])

  // 初始化时加载保存的设置并检查模型
  useEffect(() => {
    // 从localStorage读取保存的模型设置
    const savedProvider = localStorage.getItem(STORAGE_KEYS.SELECTED_PROVIDER) as ModelProvider
    const savedModel = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL)
    
    if (savedProvider && ['gemini', 'ollama'].includes(savedProvider)) {
      setSelectedProvider(savedProvider)
    }
    
    if (savedModel) {
      setSelectedModel(savedModel)
    }
    
    // 检查可用模型
    checkAvailableModels()
  }, [checkAvailableModels])

  /**
   * 切换模型提供商
   * @param provider 模型提供商
   */
  const switchProvider = (provider: ModelProvider) => {
    if (!modelInfo[provider]?.available) {
      console.warn(`模型提供商 ${provider} 不可用`)
      return
    }
    
    setSelectedProvider(provider)
    
    // 根据提供商设置默认模型
    let defaultModel: string
    if (provider === 'gemini') {
      defaultModel = MODEL_CONFIG.GEMINI.DEFAULT_MODEL
    } else {
      const availableModels = modelInfo.ollama.models
      defaultModel = availableModels.length > 0 ? availableModels[0] : MODEL_CONFIG.OLLAMA.DEFAULT_MODEL
    }
    
    setSelectedModel(defaultModel)
    
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.SELECTED_PROVIDER, provider)
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, defaultModel)
  }

  /**
   * 切换模型
   * @param modelName 模型名称
   */
  const switchModel = (modelName: string) => {
    const availableModels = modelInfo[selectedProvider]?.models || []
    
    if (!availableModels.includes(modelName)) {
      console.warn(`模型 ${modelName} 在当前提供商中不可用`)
      return
    }
    
    setSelectedModel(modelName)
    
    // 保存到localStorage
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, modelName)
  }

  /**
   * 获取模型状态
   * @param provider 模型提供商
   * @returns 模型是否可用
   */
  const getProviderStatus = (provider: ModelProvider): boolean => {
    return modelInfo[provider]?.available || false
  }

  /**
   * 获取可用模型列表
   * @param provider 模型提供商
   * @returns 可用模型列表
   */
  const getAvailableModels = (provider: ModelProvider): string[] => {
    return modelInfo[provider]?.models || []
  }

  /**
   * 检查当前选择的模型是否可用
   * @returns 当前模型是否可用
   */
  const isCurrentModelAvailable = (): boolean => {
    const providerAvailable = getProviderStatus(selectedProvider)
    const modelAvailable = getAvailableModels(selectedProvider).includes(selectedModel)
    return providerAvailable && modelAvailable
  }

  /**
   * 获取模型显示信息
   * @param provider 模型提供商
   * @returns 模型显示信息
   */
  const getProviderDisplayInfo = (provider: ModelProvider) => {
    const config = provider === 'gemini' ? MODEL_CONFIG.GEMINI : MODEL_CONFIG.OLLAMA
    return {
      icon: config.ICON,
      name: config.DISPLAY_NAME,
      available: getProviderStatus(provider),
      models: getAvailableModels(provider)
    }
  }

  /**
   * 自动选择可用模型
   * 如果当前模型不可用，自动切换到可用的模型
   */
  const autoSelectAvailableModel = () => {
    if (isCurrentModelAvailable()) {
      return // 当前模型可用，无需切换
    }
    
    // 尝试切换到Gemini
    if (modelInfo.gemini.available) {
      switchProvider('gemini')
      return
    }
    
    // 尝试切换到Ollama
    if (modelInfo.ollama.available && modelInfo.ollama.models.length > 0) {
      switchProvider('ollama')
      return
    }
    
    console.warn('没有可用的AI模型')
  }

  /**
   * 定时检查模型状态
   * @param interval 检查间隔（毫秒）
   */
  const startPeriodicCheck = (interval: number = 30000) => {
    const timer = setInterval(checkAvailableModels, interval)
    
    // 返回清理函数
    return () => clearInterval(timer)
  }

  return {
    /** 模型信息 */
    modelInfo,
    /** 当前选择的提供商 */
    selectedProvider,
    /** 当前选择的模型 */
    selectedModel,
    /** 是否正在检查模型 */
    isCheckingModels,
    /** 最后检查时间 */
    lastCheckTime,
    /** 错误信息 */
    error,
    
    // 控制函数
    /** 检查可用模型 */
    checkAvailableModels,
    /** 切换模型提供商 */
    switchProvider,
    /** 切换模型 */
    switchModel,
    /** 获取提供商状态 */
    getProviderStatus,
    /** 获取可用模型列表 */
    getAvailableModels,
    /** 检查当前模型是否可用 */
    isCurrentModelAvailable,
    /** 获取提供商显示信息 */
    getProviderDisplayInfo,
    /** 自动选择可用模型 */
    autoSelectAvailableModel,
    /** 开始定时检查 */
    startPeriodicCheck
  }
} 