import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // strictPort: true ,
    host: true,
    port: 3001,
    strictPort: true,
    hmr: {
      port: 3001,
      host: "localhost",
    }, 
  }
})
