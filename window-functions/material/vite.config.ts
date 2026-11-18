import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// O build gera um único index.html, com JS e CSS embutidos,
// para publicar como página ou abrir direto no navegador.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { chunkSizeWarningLimit: 4000 },
})
