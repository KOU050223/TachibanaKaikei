import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  define: {            
    'process.env': {}  
  },  
  base: process.env.GITHUB_PAGES
        ? "tachibana-kaikei"
        : "./",
  plugins: [react()],
})
