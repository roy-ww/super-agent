# Multi-AI Chat 设置和运行指南

这是一个基于 Next.js 的多模型 AI 对话应用，支持 Google Gemini API 和本地 Ollama 模型。

## 📋 功能特性

- ✨ 现代化的聊天界面设计
- 🤖 支持多个AI模型：Google Gemini + 本地 Ollama
- 🔄 一键切换不同的AI模型
- 💬 支持多轮对话和上下文记忆
- 🌙 深色/浅色主题切换
- 📱 响应式设计，支持移动端
- 💾 对话历史管理（按模型分类）
- 📋 消息复制功能
- ⚡ 实时消息状态提示
- 🏠 本地化部署支持

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 设置AI模型（至少选择一种）

#### 选项A：Google Gemini（云端，需要API密钥）

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API 密钥
3. 复制生成的 API 密钥

#### 选项B：Ollama（本地，免费）

**安装 Ollama：**
- **macOS**: `brew install ollama`
- **Windows**: 从 [Ollama官网](https://ollama.ai) 下载安装程序
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

**启动 Ollama 服务：**
```bash
ollama serve
```

**下载模型（选择一个或多个）：**
```bash
# 推荐模型
ollama pull llama2        # Llama 2 (7B) - 通用对话
ollama pull codellama     # Code Llama - 代码专用
ollama pull mistral       # Mistral (7B) - 速度快，质量高

# 其他可选模型
ollama pull llama2:13b    # Llama 2 (13B) - 更高质量
ollama pull vicuna        # Vicuna - 对话优化
ollama pull orca-mini     # Orca Mini - 轻量级
```

**验证安装：**
```bash
ollama list  # 查看已安装的模型
```

### 3. 配置环境变量

创建 `.env.local` 文件并添加以下内容：

```env
# Google Gemini API Key（如果使用 Gemini）
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Ollama 配置（如果使用 Ollama）
OLLAMA_HOST=http://localhost:11434

# 应用配置
NEXT_PUBLIC_APP_NAME=Multi-AI Chat
NEXT_PUBLIC_APP_DESCRIPTION=支持多种AI模型的智能对话应用
```

**注意：**
- 如果只使用 Ollama，可以不设置 `GOOGLE_GEMINI_API_KEY`
- 如果只使用 Gemini，可以不安装 Ollama
- 两种模型可以同时使用，应用会自动检测可用性

### 4. 运行开发服务器

```bash
npm run dev
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

## 🛠️ 项目结构

```
super-agent/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API 路由
│   │   └── chat/                 # Gemini 聊天 API
│   │       └── route.ts          # API 处理逻辑
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 主页面
├── public/                       # 静态资源
├── package.json                  # 项目依赖
├── tailwind.config.js            # Tailwind 配置
├── tsconfig.json                 # TypeScript 配置
├── next.config.js                # Next.js 配置
└── README.md                     # 项目说明
```

## 📦 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 框架**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React
- **AI模型**: 
  - Google Gemini 1.5 Flash/Pro (云端)
  - Ollama 支持多种开源模型 (本地)
- **工具**: ESLint, PostCSS

## 🎯 核心功能详解

### 多模型支持
- **Google Gemini**: 云端高质量AI模型
- **Ollama**: 本地开源模型，隐私安全
- **智能切换**: 一键切换不同AI模型
- **状态检测**: 自动检测模型可用性

### 对话管理
- 支持创建多个对话会话
- 按模型类型分类对话
- 自动生成对话标题
- 对话历史持久化存储
- 删除不需要的对话

### AI 交互
- 统一的API接口设计
- 支持长文本回复
- 错误处理和重试机制
- 响应状态可视化
- 模型信息显示

### 用户体验
- 平滑动画效果
- 响应式布局
- 键盘快捷键支持
- 主题切换功能
- 模型选择器界面

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 🚀 部署

### Vercel (推荐)

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 创建新项目
3. 连接 GitHub 仓库
4. 在环境变量中添加 `GOOGLE_GEMINI_API_KEY`
5. 部署完成

### 其他平台

支持部署到任何支持 Node.js 的平台：
- Netlify
- Railway
- Render
- 自托管服务器

## 🔒 安全注意事项

1. **API 密钥安全**
   - 永远不要在客户端代码中暴露 API 密钥
   - 使用环境变量存储敏感信息
   - 定期轮换 API 密钥

2. **内容过滤**
   - Gemini API 内置安全过滤
   - 不当内容会被自动拦截
   - 可根据需要调整安全设置

## 🐛 常见问题

### Q: API 密钥无效错误
A: 请检查 `.env.local` 文件中的 API 密钥是否正确，确保没有多余的空格。

### Q: 请求频率限制
A: Gemini API 有频率限制，请适当控制请求频率，或考虑升级 API 配额。

### Q: 样式没有生效
A: 确保已正确安装和配置 Tailwind CSS，运行 `npm run dev` 重新启动开发服务器。

### Q: 无法连接到 API
A: 检查网络连接，确保可以访问 Google AI 服务。

## 📄 环境变量说明

| 变量名 | 必需 | 说明 | 默认值 |
|--------|------|------|---------|
| `GOOGLE_GEMINI_API_KEY` | ⚠️ | Google Gemini API 密钥（使用Gemini时必需） | - |
| `OLLAMA_HOST` | ⚠️ | Ollama服务地址（使用Ollama时可选） | `http://localhost:11434` |
| `NEXT_PUBLIC_APP_NAME` | ❌ | 应用名称 | `Multi-AI Chat` |
| `NEXT_PUBLIC_APP_DESCRIPTION` | ❌ | 应用描述 | - |

**注意**: ⚠️ 表示在使用对应功能时必需

## 🔄 版本更新

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新信息。

## 📞 技术支持

如果在设置或使用过程中遇到问题，请：

1. 查看本文档的常见问题部分
2. 检查项目的 Issues 页面
3. 提交新的 Issue 描述问题

## 📜 许可证

本项目基于 MIT 许可证开源。

---

**Happy Coding! 🎉** 