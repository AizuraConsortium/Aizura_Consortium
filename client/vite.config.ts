import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, '../dist/client'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173
  }
});
