import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Dev serves downloaded language assets from dist/ while React uses HMR.
  // Build must NOT copy dist/ into itself; data:sync runs after Vite build.
  publicDir: command === 'serve' ? 'dist' : false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
