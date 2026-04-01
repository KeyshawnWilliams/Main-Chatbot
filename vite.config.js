import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Ensure this plugin is installed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
})