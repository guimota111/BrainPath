import { Link, Outlet } from 'react-router-dom'
import { Moon, Sun, Target } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../lib/theme'
import { useStudyMode } from '../lib/studyModeContext'

export function AppLayout() {
  const { theme, toggle } = useTheme()
  const { training, toggleTraining } = useStudyMode()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-hairline bg-page/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link
            to="/"
            className="text-[13px] font-semibold tracking-[0.14em] text-ink uppercase transition-opacity hover:opacity-70"
          >
            BrainPath
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTraining}
              aria-pressed={training}
              title="No modo treino, cada elemento pergunta antes de revelar"
              className={clsx(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium tracking-wide transition-colors',
                training
                  ? 'bg-series-3/15 text-series-3'
                  : 'text-ink-muted hover:bg-ink/5 hover:text-ink',
              )}
            >
              <Target size={13} />
              treino
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label="Alternar tema claro e escuro"
              className="flex size-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-hairline px-5 py-6 sm:px-8">
        <p className="mx-auto max-w-6xl text-[11px] leading-relaxed text-ink-muted">
          Material de apoio ao estudo. Não substitui as classificações vigentes nem serve como
          ferramenta diagnóstica.
        </p>
      </footer>
    </div>
  )
}
