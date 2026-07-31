import { useCallback } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTopic } from '../content/registry'
import { AREAS, type Scene } from '../content/schema'
import { accentStyle } from '../lib/accent'
import { MarkerMatrix } from '../artifacts/marker-matrix/MarkerMatrix'
import { HotspotMap } from '../artifacts/hotspot-map/HotspotMap'
import { LayerStack } from '../artifacts/layer-stack/LayerStack'

export function TopicPage() {
  const { slug } = useParams()
  const topic = slug ? getTopic(slug) : undefined
  const [, setParams] = useSearchParams()

  const matrixScene = topic?.scenes.find((scene) => scene.kind === 'matrix')

  /**
   * Ponte entre artifacts: um padrão arquitetural clicado no mapa abre a entidade
   * correspondente no painel imuno e leva o leitor até lá. As cenas conversam
   * porque compartilham a mesma URL, não porque conhecem uma à outra.
   */
  const revealInMatrix = useCallback(
    (entityId: string) => {
      if (!matrixScene) return
      // Mesma razão do `useSceneState`: a URL viva é a única base confiável.
      const draft = new URLSearchParams(window.location.search)
      draft.set(`${matrixScene.id}.e`, entityId)
      setParams(draft)
      document.getElementById(`cena-${matrixScene.id}`)?.scrollIntoView({ behavior: 'smooth' })
    },
    [matrixScene, setParams],
  )

  if (!topic) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="text-sm text-ink-muted">Tema não encontrado.</p>
        <Link to="/" className="mt-3 inline-block text-sm text-ink hover:underline">
          Voltar ao início
        </Link>
      </div>
    )
  }

  const area = AREAS.find((a) => a.id === topic.area)

  return (
    <div style={accentStyle(topic.accent)}>
      <header className="mx-auto max-w-6xl px-5 pt-10 pb-2 sm:px-8 sm:pt-14">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.08em] text-ink-muted uppercase transition-colors hover:text-ink"
        >
          <ArrowLeft size={12} />
          {area?.label ?? 'Biblioteca'}
        </Link>

        <h1 className="mt-4 max-w-3xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-2.5 max-w-2xl text-base text-pretty text-ink-secondary">
          {topic.subtitle}
        </p>

        {topic.draft ? (
          <p className="mt-5 border-l-2 border-status-warning py-1 pl-3 text-[12px] leading-snug text-ink-secondary">
            <span className="font-semibold text-ink">Rascunho.</span> Conteúdo escrito a partir das
            fontes listadas no rodapé, ainda sem revisão de um patologista.
          </p>
        ) : null}
      </header>

      {topic.scenes.map((scene) => (
        <section
          key={scene.id}
          id={`cena-${scene.id}`}
          className="scene border-t border-hairline first:border-t-0"
          style={accentStyle(scene.accent ?? topic.accent)}
        >
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="mb-8">
              <h2 className="text-xl leading-tight font-semibold tracking-tight text-balance text-ink sm:text-2xl">
                {scene.title}
              </h2>
              {scene.lede ? (
                <p className="mt-1.5 max-w-xl text-[13px] text-ink-muted">{scene.lede}</p>
              ) : null}
            </div>
            <SceneView scene={scene} onSuggest={revealInMatrix} />
          </div>
        </section>
      ))}

      <div className="mx-auto max-w-6xl border-t border-hairline px-5 py-10 sm:px-8">
        <h2 className="text-[10px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
          Fontes
        </h2>
        <ul className="mt-3 flex flex-col gap-1.5">
          {topic.sources.map((source) => (
            <li key={source.label} className="text-[13px] leading-snug text-ink-secondary">
              {source.label}
              {source.detail ? <span className="text-ink-muted"> — {source.detail}</span> : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-ink-muted">
          Última revisão do conteúdo: {formatDate(topic.reviewedAt)}
        </p>
      </div>
    </div>
  )
}

function SceneView({ scene, onSuggest }: { scene: Scene; onSuggest: (id: string) => void }) {
  switch (scene.kind) {
    case 'matrix':
      return <MarkerMatrix scene={scene} />
    case 'hotspot':
      return <HotspotMap scene={scene} onSuggest={onSuggest} />
    case 'layers':
      return <LayerStack scene={scene} />
  }
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
