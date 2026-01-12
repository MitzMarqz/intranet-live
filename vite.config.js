import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/intranet-live/',  // Keep your GitHub repo base
  plugins: [react()],
  server: {
    proxy: {
      // Existing Google Scripts proxy
      '/macros': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,
      },
      // New backend proxy for Jira API
      '/api': {
        target: 'http://localhost:5175', // your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


