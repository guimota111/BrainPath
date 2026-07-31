import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * O site é servido em https://guimota111.github.io/BrainPath/, então todo asset
 * precisa sair com esse prefixo. Fica fixo em vez de condicional ao ambiente:
 * assim o build local é idêntico ao publicado, e um erro de caminho aparece na
 * sua máquina em vez de aparecer só na produção.
 */
const BASE = '/BrainPath/'

/**
 * O GitHub Pages não tem regra de reescrita. Sem um 404.html igual ao index,
 * abrir /tema/<slug> direto na barra de endereço devolve erro — e a regra do
 * projeto de guardar o estado na URL morreria justamente no link compartilhado,
 * que é para o que ela existe. O Pages serve 404.html em qualquer rota que não
 * seja um arquivo, o que devolve o controle ao roteador do React.
 */
function spaFallback(): Plugin {
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync(resolve('dist/index.html'), resolve('dist/404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), spaFallback()],
})
