/**
 * O schema de conteúdo do BrainPath.
 *
 * Um tema é escrito como dado, não como página. Quem escreve conteúdo descreve
 * *o que* é verdade sobre o assunto; os artifacts em `src/artifacts` decidem
 * *como* aquilo vira arte interativa. Essa separação é o que permite trocar a
 * apresentação inteira sem reescrever uma linha de patologia.
 */

/* ------------------------------------------------------------------ *
 * Profundidade — as regras 1 e 2 do projeto, codificadas
 * ------------------------------------------------------------------ */

/**
 * Todo elemento clicável do site declara sua informação nestas camadas.
 * A ordem é deliberada e nunca muda: o leitor sempre encontra rótulo antes de
 * frase, frase antes de painel. É o que faz o site inteiro ser previsível.
 *
 *  - `glance`  L1 · o rótulo. 2 a 5 palavras. É tudo que aparece sem clique.
 *  - `brief`   L2 · uma frase. Abre no lugar, sem tirar o leitor da arte.
 *  - `detail`  L3 · o painel. Mecanismo, armadilhas, exceções.
 *  - `probe`   opcional · a pergunta do modo treino, feita antes de revelar L2.
 */
export interface Depth {
  glance: string
  brief?: string
  detail?: DetailBlock[]
  probe?: string
}

/** Blocos que compõem um painel L3. Nunca aparecem antes de um clique. */
export type DetailBlock =
  | { kind: 'text'; body: string }
  | { kind: 'list'; title?: string; items: string[] }
  /** Armadilha diagnóstica — renderizada com destaque de alerta. */
  | { kind: 'pitfall'; body: string }
  /** Regra prática que o patologista leva para a bancada. */
  | { kind: 'rule'; body: string }

/* ------------------------------------------------------------------ *
 * Cenas — cada `kind` corresponde a um artifact
 * ------------------------------------------------------------------ */

/** Resultado de um marcador. `variable` = expressão inconstante e não dirimente. */
export type MarkerResult = 'pos' | 'neg' | 'subset' | 'variable'

export interface MarkerEntity {
  id: string
  /** Sigla que aparece na matriz. Curta — é rótulo gráfico, não título. */
  short: string
  name: string
  depth: Depth
  /** markerId → resultado. Marcadores ausentes aqui ficam como lacuna. */
  results: Record<string, MarkerResult>
  /** markerId → por que esse marcador importa *nesta* entidade. Abre no clique da célula. */
  notes?: Record<string, string>
}

export interface MarkerColumn {
  id: string
  label: string
  depth: Depth
}

/**
 * Cena 1 — o painel imuno-histoquímico.
 * As colunas que discriminam são calculadas a partir de `entities`, nunca
 * marcadas à mão: assim o realce continua correto quando o conteúdo muda.
 */
export interface MatrixScene {
  kind: 'matrix'
  id: string
  title: string
  /** Frase de uma linha sobre a cena. Some assim que o leitor interage. */
  lede?: string
  accent?: AccentToken
  columns: MarkerColumn[]
  entities: MarkerEntity[]
}

/** Uma região clicável do mapa. `shape` é geometria SVG em viewBox 0 0 100 100. */
export interface Hotspot {
  id: string
  depth: Depth
  /** Caminho SVG da região. Coordenadas no viewBox da arte. */
  path: string
  /** Onde ancorar o rótulo, no mesmo viewBox. */
  label: { x: number; y: number }
  /** Entidades que costumam mostrar esse padrão — viram atalho para a matriz. */
  suggests?: { entityId: string; label: string }[]
}

/**
 * Cena 2 — a arte esquemática com regiões clicáveis.
 * `art` nomeia um desenho registrado em `src/artifacts/hotspot-map/art`.
 */
export interface HotspotScene {
  kind: 'hotspot'
  id: string
  title: string
  lede?: string
  accent?: AccentToken
  art: string
  hotspots: Hotspot[]
}

export interface Layer {
  id: string
  /** Nome do nível na escada lateral. Ex.: "Arquitetura", "Molecular". */
  step: string
  depth: Depth
  /**
   * Marcas desenhadas sobre a arte quando este nível está ativo.
   * Acumulam: o nível 3 mostra também as marcas dos níveis 1 e 2.
   */
  marks?: LayerMark[]
}

export interface LayerMark {
  id: string
  /** Coordenadas no viewBox 0 0 100 100 da arte da cena. */
  x: number
  y: number
  label: string
  /** Texto revelado ao clicar na marca. */
  note?: string
}

/**
 * Cena 3 — camadas sobre a mesma arte.
 * O leitor desce um nível por vez e o desenho ganha informação sem trocar.
 */
export interface LayerScene {
  kind: 'layers'
  id: string
  title: string
  lede?: string
  accent?: AccentToken
  art: string
  layers: Layer[]
}

export type Scene = MatrixScene | HotspotScene | LayerScene

export type AccentToken =
  | 'series-1'
  | 'series-2'
  | 'series-3'
  | 'series-4'
  | 'series-5'
  | 'series-6'
  | 'series-7'
  | 'series-8'

/* ------------------------------------------------------------------ *
 * Tema
 * ------------------------------------------------------------------ */

export interface Source {
  label: string
  detail?: string
}

export interface Topic {
  slug: string
  title: string
  /** Uma linha. Aparece na capa do tema, acima da primeira cena. */
  subtitle: string
  area: AreaId
  accent: AccentToken
  /** Termos de busca da porta "por achado": padrões, órgãos, marcadores. */
  findings: string[]
  sources: Source[]
  /** ISO date da última revisão. Conteúdo de patologia sem data não serve. */
  reviewedAt: string
  /**
   * Escrito mas ainda não conferido por um patologista. O site marca isso na
   * cara do leitor — conteúdo médico não revisado não pode passar por revisado.
   */
  draft?: boolean
  scenes: Scene[]
}

export type AreaId =
  | 'hematopatologia'
  | 'uropatologia'
  | 'dermatopatologia'
  | 'gastrointestinal'
  | 'mama-ginecologica'
  | 'pulmao-mediastino'
  | 'partes-moles'
  | 'neuropatologia'

export interface Area {
  id: AreaId
  label: string
  accent: AccentToken
}

export const AREAS: Area[] = [
  { id: 'hematopatologia', label: 'Hematopatologia', accent: 'series-7' },
  { id: 'uropatologia', label: 'Uropatologia', accent: 'series-1' },
  { id: 'dermatopatologia', label: 'Dermatopatologia', accent: 'series-2' },
  { id: 'gastrointestinal', label: 'Trato gastrointestinal', accent: 'series-3' },
  { id: 'mama-ginecologica', label: 'Mama e ginecológica', accent: 'series-5' },
  { id: 'pulmao-mediastino', label: 'Pulmão e mediastino', accent: 'series-4' },
  { id: 'partes-moles', label: 'Partes moles e osso', accent: 'series-6' },
  { id: 'neuropatologia', label: 'Neuropatologia', accent: 'series-8' },
]
