import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Replace 'Main-Chatbot' with your actual GitHub repository name
  base: '/Main-Chatbot/', 
  plugins: [react()]
})