import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/soundcloud': {
        target: 'https://api-v2.soundcloud.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/soundcloud/, ''),
      },
    },
  },
})
