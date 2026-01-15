import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Added framer-motion support
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react')) return 'vendor-react';
          if (id.includes('date-fns')) return 'vendor-date';
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('@google/generative-ai')) return 'vendor-gemini';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('canvas-confetti')) return 'vendor-effects';
          return 'vendor';
        },
      },
    },
  },
})
