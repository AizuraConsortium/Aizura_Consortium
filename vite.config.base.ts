import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export interface AppConfig {
  appName: 'admin' | 'client' | 'website';
  port: number;
}

export const createViteConfig = (config: AppConfig): UserConfig => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const appDir = path.resolve(__dirname, config.appName);

  return defineConfig({
    plugins: [react()],
    root: appDir,
    build: {
      outDir: path.resolve(__dirname, `dist/${config.appName}`),
      emptyOutDir: true
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, 'shared')
      }
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: config.port
    }
  });
};
