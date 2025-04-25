
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Security Headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.gpteng.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.lovable.dev https://cdn.gpteng.co",
    },
    // Rate Limiting Middleware
    middlewares: [
      async (req, res, next) => {
        const rateLimit = {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100 // limit each IP to 100 requests per windowMs
        };
        
        // Simple rate limiting implementation
        const ip = req.socket.remoteAddress;
        const now = Date.now();
        const windowStart = now - rateLimit.windowMs;
        
        // Clean up old requests
        global.requests = global.requests || {};
        global.requests[ip] = (global.requests[ip] || []).filter(time => time > windowStart);
        
        if (global.requests[ip].length >= rateLimit.max) {
          res.writeHead(429, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Too many requests' }));
          return;
        }
        
        global.requests[ip].push(now);
        next();
      }
    ]
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
  // Input size limits
  optimizeDeps: {
    entries: {
      maxSize: '2mb' // Limit bundle size
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 2000, // 2MB warning limit
  }
}));
