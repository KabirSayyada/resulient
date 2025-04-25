
import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { IncomingMessage, ServerResponse } from "http";

// Define the request tracking interface
interface RequestTracker {
  [ip: string]: number[];
}

// Declare global namespace for request tracking
declare global {
  var requests: RequestTracker;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
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
      async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const rateLimit = {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100 // limit each IP to 100 requests per windowMs
        };
        
        // Simple rate limiting implementation
        const ip = req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        const windowStart = now - rateLimit.windowMs;
        
        // Clean up old requests
        global.requests = global.requests || {};
        global.requests[ip] = (global.requests[ip] || []).filter((time: number) => time > windowStart);
        
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
  // Input size limits - corrected format
  optimizeDeps: {
    // Using string array for entries instead of object with maxSize
    entries: [
      'src/main.tsx',
    ],
    // Add size limit through other means if needed
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

