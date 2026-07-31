import { Fragment } from 'react'
import { scatter, scatterDisc, type Cell } from './random'
import type { ArtProps } from './types'

/**
 * Linfonodo esquemático dividido em quatro quadrantes, cada um com o padrão
 * arquitetural de um dos diferenciais. Não é um corte real — é um mnemônico
 * visual: a textura de cada quadrante é o que se enxerga no aumento pequeno,
 * e a diferença entre elas precisa se resolver na visão periférica.
 *
 * Coordenadas no viewBox 0 0 100 100, iguais às dos hotspots do conteúdo.
 */

/* Quadrante 1 — nodular: folículos densos e confluentes, sem zona de manto. */
const NODULAR_FOLLICLES = [
  { cx: 19, cy: 24, r: 11 },
  { cx: 39, cy: 33, r: 9.5 },
  { cx: 36, cy: 12, r: 8 },
]
const NODULAR_CELLS = NODULAR_FOLLICLES.map((f, i) =>
  scatterDisc(101 + i, f.cx, f.cy, f.r - 1.2, Math.round(f.r * 18), 0.78),
)
const NODULAR_BACKDROP = scatter(110, { x: 3, y: 3, w: 46, h: 46 }, 55, 0.65)

/* Quadrante 2 — difuso: monotonia total, nenhuma estrutura a que se agarrar. */
const DIFUSO_CELLS = scatter(201, { x: 50, y: 2, w: 49, h: 48 }, 470, 0.8)

/* Quadrante 3 — zona marginal: coroa de células claras e maiores em volta de folículo residual. */
const MZ_FOLLICLE = { cx: 25, cy: 73, r: 8 }
const MZ_HALO_R = 18
const MZ_CORE = scatterDisc(301, MZ_FOLLICLE.cx, MZ_FOLLICLE.cy, MZ_FOLLICLE.r - 1, 95, 0.8)
const MZ_HALO = scatterDisc(302, MZ_FOLLICLE.cx, MZ_FOLLICLE.cy, MZ_HALO_R, 105, 1.7).filter(
  (c) => Math.hypot(c.x - MZ_FOLLICLE.cx, c.y - MZ_FOLLICLE.cy) > MZ_FOLLICLE.r + 1.5,
)
const MZ_BACKDROP = scatter(303, { x: 3, y: 51, w: 46, h: 46 }, 90, 0.75)

/* Quadrante 4 — centros de proliferação: clareiras de limite vago num fundo difuso. */
const PC_PATCHES = [
  { cx: 69, cy: 70, r: 10 },
  { cx: 86, cy: 84, r: 7.5 },
]
const PC_BACKDROP = scatter(401, { x: 50, y: 50, w: 49, h: 49 }, 430, 0.8).filter(
  // Abre a clareira: o fundo difuso rareia dentro dos centros de proliferação.
  (c) => !PC_PATCHES.some((p) => Math.hypot(c.x - p.cx, c.y - p.cy) < p.r * 0.9),
)
const PC_LARGE = PC_PATCHES.flatMap((p, i) => scatterDisc(410 + i, p.cx, p.cy, p.r - 2.5, 7, 1.6))

function Cells({ cells, opacity = 0.8 }: { cells: Cell[]; opacity?: number }) {
  return (
    <g fill="var(--color-tissue-nucleus)" opacity={opacity}>
      {cells.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} />
      ))}
    </g>
  )
}

export function LinfonodoPadroes({ activeId, clipId }: ArtProps) {
  /** Quadrante não selecionado recua; nada some, para o contraste seguir legível. */
  const fade = (id: string) => (activeId === null || activeId === id ? 1 : 0.2)

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="50" cy="50" rx="46" ry="42" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="100" height="100" fill="var(--color-tissue-cytoplasm)" />

        {/* 1 · nodular */}
        <g style={{ opacity: fade('nodular'), transition: 'opacity 300ms' }}>
          <Cells cells={NODULAR_BACKDROP} opacity={0.28} />
          {NODULAR_FOLLICLES.map((f, i) => (
            <Fragment key={i}>
              <circle
                cx={f.cx}
                cy={f.cy}
                r={f.r}
                fill="var(--color-tissue-nucleus)"
                opacity="0.14"
              />
              <Cells cells={NODULAR_CELLS[i]} opacity={0.9} />
              <circle
                cx={f.cx}
                cy={f.cy}
                r={f.r}
                fill="none"
                stroke="var(--color-tissue-nucleus)"
                strokeWidth="0.6"
                opacity="0.4"
              />
            </Fragment>
          ))}
        </g>

        {/* 2 · difuso */}
        <g style={{ opacity: fade('difuso'), transition: 'opacity 300ms' }}>
          <Cells cells={DIFUSO_CELLS} opacity={0.72} />
        </g>

        {/* 3 · zona marginal */}
        <g style={{ opacity: fade('zona-marginal'), transition: 'opacity 300ms' }}>
          <Cells cells={MZ_BACKDROP} opacity={0.24} />
          <circle
            cx={MZ_FOLLICLE.cx}
            cy={MZ_FOLLICLE.cy}
            r={MZ_HALO_R}
            fill="var(--color-tissue-cytoplasm)"
          />
          {/* Citoplasma amplo e claro: o halo é feito de células maiores e pálidas. */}
          <g
            fill="var(--color-tissue-nucleus)"
            fillOpacity="0.16"
            stroke="var(--color-tissue-nucleus)"
            strokeWidth="0.35"
            strokeOpacity="0.5"
          >
            {MZ_HALO.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} />
            ))}
          </g>
          <circle
            cx={MZ_FOLLICLE.cx}
            cy={MZ_FOLLICLE.cy}
            r={MZ_FOLLICLE.r}
            fill="var(--color-tissue-nucleus)"
            opacity="0.16"
          />
          <Cells cells={MZ_CORE} opacity={0.92} />
        </g>

        {/* 4 · centros de proliferação */}
        <g style={{ opacity: fade('centros-proliferacao'), transition: 'opacity 300ms' }}>
          <Cells cells={PC_BACKDROP} opacity={0.72} />
          {PC_PATCHES.map((p, i) => (
            <circle
              key={i}
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill="var(--color-tissue-cytoplasm)"
              opacity="0.75"
            />
          ))}
          <g
            fill="var(--color-tissue-nucleus)"
            fillOpacity="0.3"
            stroke="var(--color-tissue-nucleus)"
            strokeWidth="0.4"
            strokeOpacity="0.55"
          >
            {PC_LARGE.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} />
            ))}
          </g>
        </g>

        {/* A cruz que anuncia os quatro compartimentos, sem competir com a textura. */}
        <g stroke="var(--color-tissue-stroma)" strokeWidth="0.5" opacity="0.65">
          <line x1="50" y1="0" x2="50" y2="100" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>
      </g>

      <ellipse
        cx="50"
        cy="50"
        rx="46"
        ry="42"
        fill="none"
        stroke="var(--color-tissue-stroma)"
        strokeWidth="1.75"
      />
    </>
  )
}
