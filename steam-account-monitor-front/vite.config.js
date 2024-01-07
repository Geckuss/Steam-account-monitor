import ViteGhPages from 'vite-plugin-gh-pages';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Steam-account-monitor/',
  plugins: [react()],
  server: {
    proxy: {
      '/search': 'http://129.151.218.86:3000',
    },
  },
});
