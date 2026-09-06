import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Base is '/' for Netlify/Vercel. For GitHub Pages set base to '/<repo-name>/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: false },
});
