import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Java learning data lives in data-knowledge/java, but is served at the
  // same root URLs (/module-catalog.json, /module/**, /search/**).
  // The frontend does not run Java/Gradle or require the original repository.
  publicDir: 'data-knowledge/java',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
