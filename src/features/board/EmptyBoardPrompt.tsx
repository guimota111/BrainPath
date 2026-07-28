import { Brain } from 'lucide-react'

export function EmptyBoardPrompt() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-series-1/10 text-series-1">
        <Brain size={26} />
      </div>
      <p className="max-w-xs text-sm text-ink-muted">Selecione ou crie um tópico na barra lateral para começar.</p>
    </div>
  )
}
