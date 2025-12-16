import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'
import crypto from 'crypto'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    proxy: {
      '/api/baotintuc': {
        target: 'https://baotintuc.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baotintuc/, ''),
        secure: false,
        agent: new https.Agent({
          secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT, // Fix for EPROTO error
        }),
      },
    },
  },
})
