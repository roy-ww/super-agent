# 🔧 Multi-AI Chat 故障排除指南

本文档帮助您解决使用 Multi-AI Chat 应用时可能遇到的常见问题。应用支持 Google Gemini 和 Ollama 两种AI模型。

## 🚨 常见错误及解决方案

### 🤖 Gemini 相关问题

#### 错误：`未配置 Gemini API 密钥`
**原因**：没有设置 API 密钥或密钥格式不正确
**解决方案**：
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取 API 密钥
2. 在 `.env.local` 文件中正确配置：
   ```env
   GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. 确保没有多余的空格或换行符
4. 重启开发服务器：`npm run dev`

#### 错误：`API密钥无效，请检查配置`
**原因**：API 密钥错误或已过期
**解决方案**：
1. 检查 API 密钥是否正确复制
2. 确认 API 密钥在 Google AI Studio 中是否有效
3. 重新生成新的 API 密钥

#### 错误：`Gemini API在当前地区不可用`
**原因**：Gemini API 在某些地区不可用
**解决方案**：
1. **推荐**：切换到 Ollama 本地模型（无地区限制）
2. 使用 VPN 连接到支持的地区（如美国）
3. 确认您的 IP 地址在支持的地区
4. 联系网络管理员了解访问限制

### 🦙 Ollama 相关问题

#### 错误：`无法连接到Ollama服务`
**原因**：Ollama 服务未启动或端口配置错误
**解决方案**：
1. **启动 Ollama 服务**：
   ```bash
   ollama serve
   ```
2. **检查服务状态**：
   ```bash
   curl http://localhost:11434/api/tags
   ```
3. **检查端口配置**：
   确认 `.env.local` 中的配置：
   ```env
   OLLAMA_HOST=http://localhost:11434
   ```
4. **检查防火墙**：确保端口 11434 没有被阻止

#### 错误：`ollama: command not found`
**原因**：Ollama 未正确安装
**解决方案**：
1. **macOS 安装**：
   ```bash
   brew install ollama
   ```
2. **Linux 安装**：
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
3. **Windows 安装**：
   从 [Ollama官网](https://ollama.ai) 下载安装程序

#### 错误：`模型未找到` 或 `no such model`
**原因**：请求的模型未下载
**解决方案**：
1. **查看已安装模型**：
   ```bash
   ollama list
   ```
2. **下载常用模型**：
   ```bash
   ollama pull llama2        # 通用对话 (7B)
   ollama pull codellama     # 代码专用
   ollama pull mistral       # 轻量高效
   ollama pull qwq           # 推理专用
   ```
3. **下载特定模型**：
   ```bash
   ollama pull model_name:tag
   ```

#### 错误：`模型下载失败` 或 `download interrupted`
**原因**：网络问题或磁盘空间不足
**解决方案**：
1. **检查网络连接**：确保网络稳定
2. **检查磁盘空间**：模型文件通常很大（几GB）
3. **重试下载**：
   ```bash
   ollama pull model_name --force
   ```
4. **使用国内镜像**（如有）：
   ```bash
   export OLLAMA_MIRROR=https://your-mirror-url
   ollama pull model_name
   ```

### 🔄 模型切换问题

#### 问题：模型选择器显示不可用
**原因**：对应的模型服务未启动或配置错误
**解决方案**：
1. **检查模型状态**：
   ```bash
   # 测试模型检查API
   curl http://localhost:3000/api/models
   ```
2. **Gemini 问题**：检查 API 密钥配置
3. **Ollama 问题**：确认服务正在运行
4. **刷新状态**：点击设置中的刷新按钮

#### 问题：切换模型后无响应
**解决方案**：
1. 确认目标模型确实可用
2. 查看浏览器控制台的错误信息
3. 重新选择模型并创建新对话

### 📡 网络和连接问题

#### 错误：`请求过于频繁，请稍后重试`
**原因**：超出了 API 调用频率限制（仅Gemini）
**解决方案**：
1. 等待几分钟后重试
2. **切换到 Ollama**：本地模型无频率限制
3. 检查是否有多个应用实例在同时运行

#### 错误：`API调用配额已用完`
**原因**：超出了免费配额限制（仅Gemini）
**解决方案**：
1. **切换到 Ollama**：本地模型免费使用
2. 等待配额重置（通常是每月重置）
3. 升级到付费计划

### 🚀 应用启动问题

#### 错误：`端口已被占用`
**解决方案**：
```bash
# 查找占用端口的进程
sudo lsof -ti:3000

# 杀死占用端口的进程
sudo lsof -ti:3000 | xargs kill -9

# 或使用不同端口启动
npm run dev -- --port 3001
```

#### 错误：`依赖安装失败`
**解决方案**：
```bash
# 清理缓存并重新安装
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 错误：`找不到模块"ollama"`
**原因**：Ollama npm 包未安装
**解决方案**：
```bash
npm install ollama
```

### 🎨 界面问题

#### 模型状态显示错误
**解决方案**：
1. 点击设置中的刷新按钮
2. 重启应用服务器
3. 检查对应模型服务的状态

#### 模型图标不显示
**解决方案**：
1. 刷新页面
2. 清除浏览器缓存
3. 检查浏览器是否支持表情符号

## 🔍 调试方法

### 1. 检查模型状态API
```bash
# 获取所有模型状态
curl http://localhost:3000/api/chat

# 获取详细模型信息  
curl http://localhost:3000/api/models
```

### 2. 测试 Ollama 连接
```bash
# 检查 Ollama 服务
curl http://localhost:11434/api/tags

# 测试模型调用
curl http://localhost:11434/api/generate \
  -d '{"model":"llama2","prompt":"Hello"}'
```

### 3. 测试应用 API
```bash
# 测试 Ollama 模型
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "测试",
    "conversation_id": "test",
    "history": [],
    "model_provider": "ollama",
    "model_name": "llama2"
  }'

# 测试 Gemini 模型
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "测试", 
    "conversation_id": "test",
    "history": [],
    "model_provider": "gemini",
    "model_name": "gemini-1.5-flash"
  }'
```

## 📋 环境检查清单

在报告问题之前，请检查以下项目：

### 通用检查
- [ ] Node.js 版本 >= 18
- [ ] npm 依赖已正确安装
- [ ] 应用服务器正常运行（http://localhost:3000）
- [ ] 浏览器支持现代 JavaScript 特性

### Gemini 相关检查
- [ ] `.env.local` 文件存在且配置正确
- [ ] `GOOGLE_GEMINI_API_KEY` 有效且未过期
- [ ] 网络可以访问 Google AI 服务
- [ ] 当前地区支持 Gemini API

### Ollama 相关检查
- [ ] Ollama 已正确安装
- [ ] Ollama 服务正在运行（`ollama serve`）
- [ ] 端口 11434 未被阻止
- [ ] 至少下载了一个模型（`ollama list`）
- [ ] 有足够的磁盘空间和内存

## 💡 性能优化建议

### Ollama 性能优化
1. **内存配置**：确保有足够RAM（7B模型需要8GB+）
2. **GPU 加速**：如有NVIDIA GPU，安装CUDA支持
3. **模型选择**：根据硬件选择合适大小的模型

### 网络优化
1. **并发限制**：避免同时发起多个请求
2. **超时设置**：合理设置请求超时时间
3. **错误重试**：实现智能重试机制

## 🆘 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. **查看完整错误信息**：复制完整的错误堆栈信息
2. **描述重现步骤**：详细说明如何重现问题
3. **提供环境信息**：操作系统、Node.js版本、浏览器等
4. **检查相关文档**：
   - [Ollama 文档](https://ollama.ai/docs)
   - [Gemini API 文档](https://ai.google.dev/gemini-api/docs)
   - [Next.js 文档](https://nextjs.org/docs)

## 📝 问题报告模板

```
### 问题描述
[简述问题]

### 使用的模型
- [ ] Google Gemini
- [ ] Ollama (模型名称：_______)

### 错误信息
[粘贴完整错误信息]

### 重现步骤
1. 
2. 
3. 

### 环境信息
- 操作系统：
- Node.js 版本：
- 浏览器：
- Ollama 版本（如果使用）：

### 已尝试的解决方案
[列出已尝试的方法]
```

---

**提示**：如果 Gemini API 在您的地区不可用，推荐使用 Ollama 本地模型！本地模型无地区限制，保护隐私，完全免费！ 🦙🔥 