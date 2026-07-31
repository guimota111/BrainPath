import { LinfonodoPadroes } from './LinfonodoPadroes'
import { CampoLinfoide } from './CampoLinfoide'
import type { Art, LayerArt } from './types'

/**
 * As artes são registradas por nome e referenciadas pelo conteúdo por string.
 * Assim um tema descreve *qual* figura quer sem importar componente nenhum —
 * o arquivo de conteúdo continua sendo dado puro.
 */
export const hotspotArt: Record<string, Art> = {
  'linfonodo-padroes': LinfonodoPadroes,
}

export const layerArt: Record<string, LayerArt> = {
  'campo-linfoide': CampoLinfoide,
}
