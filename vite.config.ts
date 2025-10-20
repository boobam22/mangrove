import { fileURLToPath, URL } from 'node:url'
import { dirname, relative } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: [vue(), vueJsx(), tailwindcss(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  esbuild: {
    drop: !isDev ? ['console', 'debugger'] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router'],
          iconify: ['@iconify/vue'],
        },
        chunkFileNames(chunkInfo) {
          if (chunkInfo.facadeModuleId) {
            const path = relative('./src', dirname(chunkInfo.facadeModuleId))
            return `assets/${path}/[name]-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },
      },
    },
  },
})
