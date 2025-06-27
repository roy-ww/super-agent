/**
 * Tailwind CSS 配置文件
 * 定义了样式系统的主题、扩展和插件配置
 * 支持深色模式和自定义动画效果
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 内容扫描路径 - 告诉Tailwind在哪些文件中查找类名
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',      // Pages目录下的所有页面文件
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Components目录下的所有组件文件
    './app/**/*.{js,ts,jsx,tsx,mdx}',        // App目录下的所有文件（Next.js 13+ App Router）
  ],
  
  // 主题配置
  theme: {
    extend: {
      // 扩展颜色调色板
      colors: {
        // 主色调 - 蓝色系
        primary: {
          50: '#f0f9ff',   // 最浅的蓝色，用于背景
          500: '#3b82f6',  // 标准蓝色，用于按钮和链接
          600: '#2563eb',  // 深蓝色，用于悬停状态
          700: '#1d4ed8',  // 更深的蓝色，用于激活状态
        },
        // 灰色系 - 用于文本、边框、背景等
        gray: {
          50: '#f9fafb',   // 最浅灰色，浅色模式背景
          100: '#f3f4f6',  // 很浅的灰色
          200: '#e5e7eb',  // 浅灰色，用于边框
          300: '#d1d5db',  // 浅灰色，用于禁用状态
          400: '#9ca3af',  // 中灰色，用于占位符文本
          500: '#6b7280',  // 标准灰色，用于次要文本
          600: '#4b5563',  // 深灰色，用于正文文本
          700: '#374151',  // 更深灰色，用于标题
          800: '#1f2937',  // 深灰色，深色模式背景
          900: '#111827',  // 最深灰色，深色模式主背景
        }
      },
      
      // 扩展动画效果
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',              // 淡入动画
        'slide-up': 'slideUp 0.3s ease-out',               // 滑入动画
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // 慢速脉冲动画
      },
      
      // 自定义动画关键帧
      keyframes: {
        // 淡入动画关键帧
        fadeIn: {
          '0%': { opacity: '0' },    // 开始时完全透明
          '100%': { opacity: '1' },  // 结束时完全不透明
        },
        // 滑入动画关键帧
        slideUp: {
          '0%': { 
            transform: 'translateY(10px)', // 开始时向下偏移10px
            opacity: '0'                   // 开始时透明
          },
          '100%': { 
            transform: 'translateY(0)',    // 结束时回到原位
            opacity: '1'                   // 结束时不透明
          },
        }
      }
    },
  },
  
  // 插件配置 - 目前未使用任何插件
  plugins: [],
  
  // 深色模式配置 - 使用类名切换模式
  // 通过添加/移除 'dark' 类名来切换深色模式
  darkMode: 'class',
} 