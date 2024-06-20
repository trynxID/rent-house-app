import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4573,
    // port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:4573',
        changeOrigin: true,
        secure: false,
      },
      '/public': {
        target: 'http://localhost:4573',
        changeOrigin: true,
      },
    },
  },
});
