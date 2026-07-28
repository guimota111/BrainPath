import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  define: {
    // react-grid-layout/legacy reads process.env["NODE_ENV"] (bracket access,
    // not matched by Vite's automatic process.env.NODE_ENV replacement)
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env': '({})',
  },
}))
