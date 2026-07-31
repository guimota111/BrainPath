import type { ComponentType } from 'react'

/** Arte de um `HotspotScene`: desenha o campo e recua o que não está selecionado. */
export interface ArtProps {
  activeId: string | null
  /** Id do clipPath que a arte publica, para o overlay de hotspots reusar. */
  clipId: string
}

/**
 * Arte de um `LayerScene`. Recebe o índice da camada ativa e decide o que já
 * apareceu: as camadas anteriores continuam desenhadas, atenuadas, para o leitor
 * ver a informação se acumulando sobre o mesmo campo em vez de trocar de figura.
 */
export interface LayerArtProps {
  activeIndex: number
}

export type Art = ComponentType<ArtProps>
export type LayerArt = ComponentType<LayerArtProps>
