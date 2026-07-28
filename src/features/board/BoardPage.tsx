import { useParams } from 'react-router-dom'
import { useBoardTreeStore } from '../../state/boardTreeStore'
import { BoardCanvas } from './BoardCanvas'

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const node = useBoardTreeStore((s) => s.nodes.find((n) => n.id === boardId))

  if (!boardId) return null

  if (!node) {
    return <div className="flex h-full items-center justify-center text-sm text-ink-muted">Quadro não encontrado.</div>
  }

  return <BoardCanvas boardId={boardId} boardTitle={node.title} />
}
