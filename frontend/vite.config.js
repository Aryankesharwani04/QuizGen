import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

/**
 * Vite Configuration
 * React 18 + Vite 5.0
 * 
 * Run: npm run dev
 * Build: npm run build
 */

export default defineConfig({
  plugins: [react()],
  
  server: {
    // Development server configuration
    port: 3000,
    host: 'localhost',
    open: true, // Open browser on start
    
    // Proxy API requests to Django backend
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  build: {
    // Production build configuration
    outDir: 'dist',
    sourcemap: false, // Set to 'inline' for debugging in production
    minify: 'terser',
    
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },

  resolve: {
    // Path aliases
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
})
