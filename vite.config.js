import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Accepts the URL with or without a trailing /api (e.g. http://host or http://host/api/).
  const backend = (env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '').replace(/\/api$/, '');
  return {
    plugins: [react()],
    // In development the browser talks only to Vite, which forwards /api to the backend.
    server: { proxy: { '/api': { target: backend, changeOrigin: true } } },
  };
});
