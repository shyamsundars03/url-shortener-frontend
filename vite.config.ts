import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendTarget = 'http://localhost:3001'

const backendProxyPaths = [
  '/health',
  '/auth',
  '/link',
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    proxy: Object.fromEntries(
      backendProxyPaths.map((path) => [
        path,
        { target: backendTarget, changeOrigin: true },
      ]),
    ),
  },
  build: {
    outDir: 'dist',
  },
})
