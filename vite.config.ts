import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Mengatasi peringatan modul eksternalisasi dan ukuran chunk
  build: {
    chunkSizeWarningLimit: 1000, // Meningkatkan batas peringatan ukuran chunk
    minify: 'terser', // Menggunakan terser untuk minifikasi yang lebih baik
    terserOptions: {
      compress: {
        drop_console: true, // Menghapus console.log
        drop_debugger: true // Menghapus debugger statements
      }
    },
    rollupOptions: {
      external: [
        'events',
        'stream',
        'buffer'
      ],
      output: {
        // Mengurangi ukuran chunk dengan memisahkan vendor
        manualChunks: (id) => {
          // React core and related packages
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/@radix-ui/react-context')) {
            return 'vendor-react-core';
          }

          // React Router
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }

          // Radix UI components - group all together to avoid context issues
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }

          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }

          // Tanstack Query
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }

          // Utility libraries
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/papaparse') ||
              id.includes('node_modules/sonner') ||
              id.includes('node_modules/zustand')) {
            return 'vendor-utils';
          }

          // CMDK - separate to avoid context conflicts
          if (id.includes('node_modules/cmdk')) {
            return 'vendor-cmdk';
          }

          // Other node_modules
          if (id.includes('node_modules')) {
            return 'vendor-others';
          }
        }
      }
    },
  },
  optimizeDeps: {
    exclude: ['events', 'stream', 'buffer'],
  },
}));
