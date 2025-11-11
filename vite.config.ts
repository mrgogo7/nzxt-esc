import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/nzxt-pinterest-integration/',
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'ie 11'],
      modernPolyfills: true,
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        config: resolve(__dirname, 'config.html'),
      },
    },
  },
})
