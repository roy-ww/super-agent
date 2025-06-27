import { Ollama } from 'ollama'
import { NextRequest, NextResponse } from 'next/server'

const ollama = new Ollama({ 
  host: process.env.OLLAMA_HOST || 'http://localhost:11434' 
})

// 获取所有可用模型
export async function GET() {
  try {
    const models = {
      gemini: {
        available: !!process.env.GOOGLE_GEMINI_API_KEY,
        models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
        status: process.env.GOOGLE_GEMINI_API_KEY ? 'ready' : 'no_api_key'
      },
      ollama: {
        available: false,
        models: [] as string[],
        status: 'disconnected'
      }
    }

    // 检查Ollama是否可用
    try {
      const ollamaModels = await ollama.list()
      models.ollama.available = true
      models.ollama.models = ollamaModels.models.map((m: any) => m.name)
      models.ollama.status = 'connected'
    } catch (error) {
      console.log('Ollama不可用:', error)
      models.ollama.status = 'disconnected'
    }

    return NextResponse.json({
      success: true,
      models,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: '获取模型列表失败',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}

// 拉取Ollama模型
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, model_name } = body

    if (action === 'pull' && model_name) {
      // 检查Ollama连接
      try {
        await ollama.list()
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: '无法连接到Ollama服务，请确保Ollama已启动'
        }, { status: 500 })
      }

      // 拉取模型（这是一个长时间运行的操作）
      try {
        const response = await ollama.pull({ model: model_name })
        return NextResponse.json({
          success: true,
          message: `模型 ${model_name} 下载完成`,
          model: model_name
        })
      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: `下载模型失败: ${error.message}`,
          model: model_name
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: false,
      error: '无效的操作或缺少参数'
    }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: '处理请求失败',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
} 