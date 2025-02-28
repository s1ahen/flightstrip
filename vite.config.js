import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/', // Adjust this if your site is hosted in a subdirectory
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'), // Entry point for your app
      },
    },
  },
});