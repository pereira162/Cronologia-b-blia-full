import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite 6: Enhanced ESM support and better path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
      const config: UserConfig = {
      base: "/Cronologia-b-blia-full/",
      
      // Plugins
      plugins: [react()],
      
      // Vite 6: Enhanced build optimizations
      build: {
        target: 'esnext',
        minify: 'esbuild',
        sourcemap: mode === 'development',
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
              heroicons: ['@heroicons/react']
            }
          }
        }
      },
      
      // Vite 6: Improved dependency optimization
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          '@heroicons/react/24/outline',
          '@heroicons/react/24/solid'
        ],
        esbuildOptions: {
          target: 'esnext'
        }
      },
      
      // Enhanced environment variables handling
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        '__DEV__': mode === 'development'
      },
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // Vite 6: Better development server configuration
      server: {
        port: 3000,
        open: true,
        cors: true
      }
    };
    
    return config;
});