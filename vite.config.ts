import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 8080,
    host: 'sjtest.yfway.com', // 显式指定 host 为 127.0.0.1
    strictPort: true, // 确保端口不被占用时自动切换
    hmr: {
      overlay: false, // 禁用 HMR 错误覆盖层
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // 确保资源路径正确
  optimizeDeps: {
    include: ['three'] // 添加需要预构建的依赖项
  },
  // 添加 public 目录配置
  publicDir: 'public'
});