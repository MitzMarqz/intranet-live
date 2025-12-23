import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: 'intranet-live',  // <-- Replace <repo-name> with your GitHub repository name
  plugins: [react()],
  server: {
    proxy: {
      '/macros': {
        target: 'https://script.google.com',
        changeOrigin: true, 
        secure: false, 
      },
    },
  },
});
