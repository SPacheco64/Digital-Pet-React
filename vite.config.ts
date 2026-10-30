import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Digital-Pet-React/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [resolve(process.cwd(), 'styles')],
        additionalData: (source, filename) =>
          filename.endsWith('_colors.scss')
            ? source
            : `@use "colors" as *;\n${source}`,
      },
    },
  },
})
