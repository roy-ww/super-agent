#!/bin/bash

# Gemini AI Chat 快速启动脚本

echo "🚀 Gemini AI Chat 启动脚本"
echo "========================="
echo ""

# 检查是否存在 .env.local 文件
if [ ! -f .env.local ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "📝 正在创建环境变量模板文件..."
    cat > .env.local << EOF
# Google Gemini API Key
# 获取方式：访问 https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# 应用配置
NEXT_PUBLIC_APP_NAME=Gemini AI Chat
NEXT_PUBLIC_APP_DESCRIPTION=与Google Gemini AI进行智能对话
EOF
    echo "✅ 已创建 .env.local 文件"
    echo ""
    echo "❗ 重要：请在 .env.local 文件中填入你的 Gemini API 密钥"
    echo "   获取密钥：https://makersuite.google.com/app/apikey"
    echo ""
    read -p "按 Enter 键继续..."
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo "✅ 依赖安装完成"
    echo ""
fi

# 检查环境变量
if grep -q "your_gemini_api_key_here" .env.local; then
    echo "⚠️  检测到默认的 API 密钥"
    echo "   请在 .env.local 文件中填入真实的 Gemini API 密钥"
    echo ""
fi

echo "🎉 正在启动开发服务器..."
echo "   访问地址: http://localhost:3000"
echo ""
echo "💡 使用提示："
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 修改代码后页面会自动刷新"
echo "   - 查看 SETUP.md 了解更多信息"
echo ""

# 启动开发服务器
npm run dev 