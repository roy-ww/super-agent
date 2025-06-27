/**
 * 模型选择器组件
 * 用于选择和切换AI模型（Gemini或Ollama）
 * 显示模型状态和可用性信息
 */

import React from 'react'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { getModelIcon, getModelDisplayName } from '../utils'
import { MODEL_CONFIG } from '../constants'
import type { ModelInfo, ModelProvider } from '../types'

/**
 * 模型选择器组件属性接口
 */
interface ModelSelectorProps {
  /** 当前选择的模型提供商 */
  selectedProvider: ModelProvider
  /** 当前选择的模型名称 */
  selectedModel: string
  /** 模型信息对象 */
  modelInfo: ModelInfo
  /** 是否正在检查模型 */
  isCheckingModels: boolean
  /** 切换模型提供商的回调函数 */
  onProviderChange: (provider: ModelProvider) => void
  /** 切换模型的回调函数 */
  onModelChange: (model: string) => void
  /** 刷新模型列表的回调函数 */
  onRefresh: () => void
}

/**
 * 模型选择器组件
 * 
 * 提供以下功能：
 * - 显示可用的模型提供商
 * - 切换模型提供商（Gemini/Ollama）
 * - 选择具体的模型
 * - 显示模型状态和可用性
 * - 刷新模型列表
 * 
 * @param props 组件属性
 * @returns JSX元素
 */
export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedProvider,
  selectedModel,
  modelInfo,
  isCheckingModels,
  onProviderChange,
  onModelChange,
  onRefresh
}) => {
  /**
   * 获取提供商状态图标
   * @param provider 模型提供商
   * @returns 状态图标组件
   */
  const getStatusIcon = (provider: ModelProvider) => {
    const available = modelInfo[provider]?.available
    if (isCheckingModels) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
    }
    return available ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )
  }

  /**
   * 获取提供商可用的模型列表
   * @param provider 模型提供商
   * @returns 模型列表
   */
  const getAvailableModels = (provider: ModelProvider): string[] => {
    return modelInfo[provider]?.models || []
  }

  return (
    <div className="space-y-6">
      {/* 标题和刷新按钮 */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI模型设置
        </h3>
        <button
          onClick={onRefresh}
          disabled={isCheckingModels}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="刷新模型列表"
        >
          <RefreshCw className={`w-4 h-4 ${isCheckingModels ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* 模型提供商选择 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          选择模型提供商
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Gemini选项 */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedProvider === 'gemini'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${
              !modelInfo.gemini?.available 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            onClick={() => modelInfo.gemini?.available && onProviderChange('gemini')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{MODEL_CONFIG.GEMINI.ICON}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {MODEL_CONFIG.GEMINI.DISPLAY_NAME}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    云端AI模型，功能强大
                  </div>
                </div>
              </div>
              {getStatusIcon('gemini')}
            </div>
            
            {/* Gemini模型列表 */}
            {selectedProvider === 'gemini' && modelInfo.gemini?.available && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  选择模型：
                </div>
                <div className="space-y-2">
                  {MODEL_CONFIG.GEMINI.AVAILABLE_MODELS.map(model => (
                    <label key={model} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gemini-model"
                        value={model}
                        checked={selectedModel === model}
                        onChange={(e) => onModelChange(e.target.value)}
                        className="text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {model}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ollama选项 */}
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedProvider === 'ollama'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${
              !modelInfo.ollama?.available 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            onClick={() => modelInfo.ollama?.available && onProviderChange('ollama')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{MODEL_CONFIG.OLLAMA.ICON}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {MODEL_CONFIG.OLLAMA.DISPLAY_NAME}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    本地部署，隐私安全
                  </div>
                </div>
              </div>
              {getStatusIcon('ollama')}
            </div>
            
            {/* Ollama模型列表 */}
            {selectedProvider === 'ollama' && modelInfo.ollama?.available && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  选择模型：
                </div>
                {getAvailableModels('ollama').length > 0 ? (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {getAvailableModels('ollama').map(model => (
                      <label key={model} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ollama-model"
                          value={model}
                          checked={selectedModel === model}
                          onChange={(e) => onModelChange(e.target.value)}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {model}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    未找到可用模型，请先下载模型
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 当前选择的模型信息 */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          当前选择：
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getModelIcon(selectedProvider)}</span>
          <span className="text-sm text-gray-900 dark:text-gray-100">
            {getModelDisplayName(selectedProvider)} · {selectedModel}
          </span>
          {modelInfo[selectedProvider]?.available ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>

      {/* 状态说明 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>模型可用</span>
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="w-3 h-3 text-red-500" />
          <span>模型不可用</span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3 h-3 text-blue-500" />
          <span>检查中...</span>
        </div>
      </div>
    </div>
  )
}

export default ModelSelector 