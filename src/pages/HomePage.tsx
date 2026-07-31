import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import { AREAS } from '../content/schema'
import { searchFindings, topics, topicsByArea } from '../content/registry'
import { accentStyle } from '../lib/accent'

type Door = 'achado' | 'tema'

/**
 * Duas portas, porque há dois momentos de uso.
 *
 * "Por achado" é a porta do meio do caso: o patologista já está no microscópio e
 * descreve o que está vendo. "Por tema" é a porta do estudo planejado. A primeira
 * é a padrão — é a que justifica o site estar aberto durante a rotina.
 */
export function HomePage() {
  const [door, setDoor] = useState<Door>('achado')
  const [query, setQuery] = useState('')

  const results = useMemo(() => searchFindings(query), [query])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-20">
      <h1 className="max-w-2xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl">
        Consulta visual
        <br />
        <span className="text-ink-muted">em patologia</span>
      </h1>

      <div className="mt-10 flex gap-6 border-b border-hairline">
        {(
          [
            ['achado', 'O que você está vendo'],
            ['tema', 'Biblioteca'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setDoor(id)}
            className={clsx(
              '-mb-px border-b-2 pb-2.5 text-[13px] font-medium transition-colors',
              door === id
                ? 'border-ink text-ink'
                : 'border-transparent text-ink-muted hover:text-ink-secondary',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {door === 'achado' ? (
        <section className="mt-8">
          <label className="flex items-center gap-3 border-b border-hairline pb-3 focus-within:border-ink">
            <Search size={17} className="shrink-0 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="padrão nodular, CD5, células monocitoides…"
              className="w-full bg-transparent text-lg text-ink outline-none placeholder:text-ink-muted/70"
            />
          </label>

          {results.length === 0 ? (
            <p className="mt-6 text-sm text-ink-muted">
              Nenhum achado indexado para isso ainda.
            </p>
          ) : (
            <ul className="mt-6 flex flex-wrap gap-2">
              {results.map(({ finding, topic }) => (
                <li key={`${topic.slug}-${finding}`}>
                  <Link
                    to={`/tema/${topic.slug}`}
                    style={accentStyle(topic.accent)}
                    className="flex items-baseline gap-2 rounded-full border border-hairline px-3.5 py-2 transition-colors hover:border-[color:var(--accent)]"
                  >
                    <span className="text-[13px] text-ink">{finding}</span>
                    <span className="text-[11px] text-ink-muted">{topic.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((area) => {
            const areaTopics = topicsByArea(area.id)
            const empty = areaTopics.length === 0
            return (
              <div key={area.id} style={accentStyle(area.accent)}>
                <div className="flex items-center gap-2 border-b border-hairline pb-1.5">
                  <span
                    className={clsx(
                      'size-1.5 rounded-full',
                      empty ? 'bg-hairline' : 'bg-[color:var(--accent)]',
                    )}
                  />
                  <h2
                    className={clsx(
                      'text-[13px] font-semibold tracking-wide',
                      empty ? 'text-ink-muted' : 'text-ink',
                    )}
                  >
                    {area.label}
                  </h2>
                </div>
                {empty ? (
                  <p className="pt-2 text-[12px] text-ink-muted/70">em aberto</p>
                ) : (
                  <ul className="pt-2">
                    {areaTopics.map((topic) => (
                      <li key={topic.slug}>
                        <Link
                          to={`/tema/${topic.slug}`}
                          className="block py-1.5 text-sm text-ink-secondary transition-colors hover:text-[color:var(--accent)]"
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </section>
      )}

      <p className="mt-14 text-[11px] text-ink-muted">
        {topics.length} {topics.length === 1 ? 'tema publicado' : 'temas publicados'}
      </p>
    </div>
  )
}
