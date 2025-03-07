/*
 * @Author: LinYiHan
 * @Date: 2025-02-26 13:43:16
 * @Description: 
 * @Version: 1.0
 */
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
    port: 3001,
    host: '127.0.0.1', // 显式指定 host 为 127.0.0.1
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
  }
});