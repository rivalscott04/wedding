import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`Building in ${mode} mode`);
  return {
  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: 'https://data.rivaldev.site',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // Log the path before rewriting
          console.log('Original path:', path);

          // Simpan path asli untuk debugging
          const originalPath = path;

          // Hapus duplikasi /api jika ada
          if (path.includes('/api/api')) {
            path = path.replace('/api/api', '/api');
          }

          // Khusus untuk endpoint attendance
          if (path.includes('/guests/') && path.includes('/attendance')) {
            // Pastikan format URL benar
            const parts = path.split('/');

            // Hapus segmen kosong dan duplikasi
            const cleanParts = [];
            const seen = new Set();

            for (const part of parts) {
              if (part && !seen.has(part)) {
                cleanParts.push(part);
                seen.add(part);
              }
            }

            // Pastikan urutan segmen benar: api/wedding/guests/[slug]/attendance
            const attendanceIndex = cleanParts.indexOf('attendance');
            if (attendanceIndex > 0) {
              // Pastikan 'attendance' adalah segmen terakhir
              const correctParts = cleanParts.slice(0, attendanceIndex + 1);
              path = '/' + correctParts.join('/');
            }
          }

          if (path !== originalPath) {
            console.log('Path rewritten from:', originalPath, 'to:', path);
          }

          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
            console.log('Request headers:', req.headers);
            console.log('Request body:', req.body);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
            console.log('Response headers:', proxyRes.headers);
          });
        }
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
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
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
        // Use a much simpler chunking strategy to avoid context issues
        manualChunks: {
          // Put React and all UI libraries in a single vendor chunk
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@radix-ui/react-context',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip',
            'cmdk',
            'sonner',
            'next-themes'
          ]
        }
      }
    },
  },
  optimizeDeps: {
    exclude: ['events', 'stream', 'buffer'],
  },
  // Explicitly set the root directory and entry point
  root: process.cwd(),
  publicDir: 'public',
};
});
