import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Static learning data is copied from producer repositories as a versioned snapshot.
  // The frontend does not run Java/Gradle or require the original repository.
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
