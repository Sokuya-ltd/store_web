import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  // Suppress TinyMCE event listener warnings in development
  define: {
    __DEV__: true,
  },
  build: {
    chunkSizeWarningLimit: 1000, // 1MB - increase from default 500KB
  },
})
