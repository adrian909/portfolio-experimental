import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2018',
    // Split CSS per chunk for better caching
    cssCodeSplit: true,
    // Disable source maps in production
    sourcemap: false,
    // Warn if any chunk exceeds 400 KB
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, cache lives long
          'vendor-react': ['react', 'react-dom'],
          // GSAP — large, rarely changes
          'vendor-gsap': ['gsap'],
          // Framer Motion — separate from GSAP
          'vendor-framer': ['framer-motion'],
        },
      },
    },
  },

  // Faster dev server: pre-bundle heavy deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap', 'framer-motion'],
  },
})
