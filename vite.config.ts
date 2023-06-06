import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@assets": resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    glsl({
      include: '**/*.glsl', // 包含的文件
      exclude: [], // 排除的文件
      compress: false, // 是否压缩 GLSL 代码
      sourceMap: true // 是否生成 source map
    }),
    vue(),
  ]
})
