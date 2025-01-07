import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import optimizer from "vite-plugin-optimizer";
import { getReplacer } from "./src/plugins/devPlugin"
import { createHtmlPlugin } from 'vite-plugin-html'
import { title } from "./src/models/config"

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: false
      })],
    }),
    viteCompression({
      //deleteOriginFile:true,
      threshold: 10240 // 对大于 1mb 的文件进行压缩
    }),
    optimizer(getReplacer()),
    createHtmlPlugin({
      inject: {
        data: {
          title: title,
        }
      }
    })
  ],
  //修改@为根目录
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  optimizeDeps: {
    // 在 dependencies 中强制排除的依赖项
    include: [],
  },
  //设置dev监听服务
  server: {
    host: '0.0.0.0',
    port: 5000,
    proxy: {
      '/api': 'http://localhost:8300/',
      '/files': 'http://localhost:8300/',
    },
  },

  build: {
    outDir: '../server/web',
    emptyOutDir: true,
    rollupOptions: {
      external: []
    },
  },
})
