import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@use-cases': path.resolve(__dirname, './src/use-cases'),
      '@adapters': path.resolve(__dirname, './src/adapters'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
});
