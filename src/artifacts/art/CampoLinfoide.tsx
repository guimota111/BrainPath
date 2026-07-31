import { scatter, scatterDisc, seeded, type Cell } from './random'
import type { LayerArtProps } from './types'

/**
 * O mesmo campo linfoide visto em quatro profundidades sucessivas.
 *
 * A figura nunca é trocada: cada camada acrescenta traçado sobre o desenho
 * anterior, que permanece e apenas recua. É a diferença entre "desenrolar" e
 * "paginar" — o leitor não perde a referência espacial ao descer um nível.
 *
 * 0 arquitetura · 1 citologia · 2 imunofenótipo · 3 molecular
 */

const FIELD = { x: 4, y: 4, w: 92, h: 92 }
const SMALL_CELLS = scatter(777, FIELD, 260, 1.5)

/* Camada 0 — nódulos vagos, o que se vê no aumento pequeno. */
const NODULES = [
  { cx: 30, cy: 32, r: 20 },
  { cx: 70, cy: 40, r: 16 },
  { cx: 48, cy: 76, r: 17 },
]

/* Camada 1 — as poucas células que decidem a citologia, ampliadas. */
const CYTOLOGY_CELLS = [
  { cx: 30, cy: 32, r: 7, label: 'cromatina em blocos' },
  { cx: 70, cy: 40, r: 6.5, label: 'contorno irregular' },
  { cx: 48, cy: 76, r: 7.5, label: 'nucléolo visível' },
]

/* Camada 3 — dois cromossomos e a troca de segmentos entre eles. */
const CHROM_LEFT = { x: 24, y: 58 }
const CHROM_RIGHT = { x: 64, y: 58 }

function Cells({ cells, opacity }: { cells: Cell[]; opacity: number }) {
  return (
    <g fill="var(--color-tissue-nucleus)" opacity={opacity}>
      {cells.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} />
      ))}
    </g>
  )
}

/** Cromatina grosseira: riscos curtos dentro do núcleo, com direções fixas. */
function Chromatin({ cx, cy, r, seed }: { cx: number; cy: number; r: number; seed: number }) {
  const rand = seeded(seed)
  const strokes = Array.from({ length: 7 }, () => {
    const angle = rand() * Math.PI
    const dist = (rand() - 0.5) * r * 1.1
    const len = r * (0.3 + rand() * 0.35)
    const px = cx + Math.cos(angle + Math.PI / 2) * dist
    const py = cy + Math.sin(angle + Math.PI / 2) * dist
    return {
      x1: px - (Math.cos(angle) * len) / 2,
      y1: py - (Math.sin(angle) * len) / 2,
      x2: px + (Math.cos(angle) * len) / 2,
      y2: py + (Math.sin(angle) * len) / 2,
    }
  })
  return (
    <g stroke="var(--color-tissue-nucleus)" strokeWidth="0.9" strokeLinecap="round" opacity="0.85">
      {strokes.map((s, i) => (
        <line key={i} {...s} />
      ))}
    </g>
  )
}

function Chromosome({ x, y, swapped }: { x: number; y: number; swapped: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="-22" width="6" height="20" rx="3" fill="var(--accent)" opacity="0.35" />
      <rect
        x="-3"
        y="2"
        width="6"
        height="20"
        rx="3"
        fill={swapped ? 'var(--color-series-2)' : 'var(--accent)'}
        opacity={swapped ? 0.75 : 0.35}
      />
      <circle cx="0" cy="0" r="2.4" fill="var(--color-tissue-stroma)" />
    </g>
  )
}

export function CampoLinfoide({ activeIndex }: LayerArtProps) {
  const shown = (index: number) => activeIndex >= index
  /** Camada já vista mas não mais a atual: fica, atenuada. */
  const weight = (index: number) => (activeIndex === index ? 1 : shown(index) ? 0.4 : 0)

  return (
    <>
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        rx="3"
        fill="var(--color-tissue-cytoplasm)"
        opacity="0.55"
      />
      <Cells cells={SMALL_CELLS} opacity={activeIndex >= 1 ? 0.28 : 0.62} />

      {/* 0 · arquitetura */}
      <g style={{ opacity: weight(0), transition: 'opacity 350ms' }}>
        {NODULES.map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.2"
            strokeDasharray="3 2.5"
            opacity="0.8"
          />
        ))}
      </g>

      {/* 1 · citologia */}
      <g style={{ opacity: weight(1), transition: 'opacity 350ms' }}>
        {CYTOLOGY_CELLS.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill="var(--color-tissue-nucleus)"
              opacity="0.18"
              stroke="var(--color-tissue-nucleus)"
              strokeWidth="0.8"
            />
            <Chromatin cx={c.cx} cy={c.cy} r={c.r} seed={900 + i} />
          </g>
        ))}
      </g>

      {/* 2 · imunofenótipo — anel duplo: co-expressão na mesma membrana. */}
      <g style={{ opacity: weight(2), transition: 'opacity 350ms' }}>
        {scatterDisc(555, 50, 50, 34, 26, 1).map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x}
              cy={c.y}
              r="3.4"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.1"
              opacity="0.9"
            />
            <circle
              cx={c.x}
              cy={c.y}
              r="5"
              fill="none"
              stroke="var(--color-series-2)"
              strokeWidth="0.9"
              opacity="0.65"
            />
          </g>
        ))}
      </g>

      {/* 3 · molecular */}
      <g style={{ opacity: weight(3), transition: 'opacity 350ms' }}>
        <rect x="8" y="26" width="84" height="60" rx="3" fill="var(--color-page)" opacity="0.88" />
        <Chromosome x={CHROM_LEFT.x} y={CHROM_LEFT.y} swapped />
        <Chromosome x={CHROM_RIGHT.x} y={CHROM_RIGHT.y} swapped={false} />
        <path
          d={`M ${CHROM_LEFT.x + 8} ${CHROM_LEFT.y + 14} Q 44 ${CHROM_LEFT.y + 24} ${CHROM_RIGHT.x - 8} ${CHROM_RIGHT.y + 14}`}
          fill="none"
          stroke="var(--color-series-2)"
          strokeWidth="1.2"
          strokeDasharray="2.5 2"
        />
      </g>
    </>
  )
}
