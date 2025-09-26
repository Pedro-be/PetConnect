import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <-- Importa el módulo 'path' de Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Agrega esta sección para configurar el alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
