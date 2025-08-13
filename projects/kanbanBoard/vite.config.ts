import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/portfolio/projects/kanbanBoard/distribution/',
  plugins: [vue()],
})
