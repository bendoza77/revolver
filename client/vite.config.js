import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@':            fileURLToPath(new URL('./src', import.meta.url)),
      '@components':  fileURLToPath(new URL('./src/components', import.meta.url)),
      '@constants':   fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@context':     fileURLToPath(new URL('./src/context', import.meta.url)),
      '@hooks':       fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@pages':       fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@utils':       fileURLToPath(new URL('./src/utils', import.meta.url)),
    },
  },

  build: {
    // Modern browsers only — smaller, faster output
    target: 'esnext',

    // Warn on chunks > 500KB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate cached chunks.
        // Browser only re-downloads a chunk when IT changes —
        // not when your app code changes.
        manualChunks(id) {
          if (id.includes('firebase'))      return 'vendor-firebase';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n';
          if (id.includes('node_modules'))  return 'vendor-react';
        },

        // Predictable file names for long-term caching
        chunkFileNames:  'assets/js/[name]-[hash].js',
        entryFileNames:  'assets/js/[name]-[hash].js',
        assetFileNames:  'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // Faster dev server — pre-bundle all heavy deps on startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'i18next',
      'react-i18next',
    ],
  },
})
