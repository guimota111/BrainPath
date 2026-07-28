import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { Brain, LogOut, Moon, Plus, Sun } from 'lucide-react'
import { auth } from '../../lib/firebase'
import { useTheme } from '../../lib/theme'
import { useAuth } from '../auth/useAuth'
import { useBoardTree } from './useBoardTree'
import { TreeNode } from './TreeNode'

export function Sidebar() {
  const { user } = useAuth()
  const { nodes, createBoard, renameBoard, deleteBoard } = useBoardTree()
  const navigate = useNavigate()
  const { boardId } = useParams<{ boardId: string }>()
  const { theme, toggle } = useTheme()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const roots = nodes.filter((n) => n.parentId === null).sort((a, b) => a.order - b.order)

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleCreate(parentId: string | null) {
    const id = await createBoard('Novo tópico', parentId)
    if (parentId) setExpandedIds((prev) => new Set(prev).add(parentId))
    setEditingId(id)
    navigate(`/board/${id}`)
  }

  function handleDelete(id: string) {
    const node = nodes.find((n) => n.id === id)
    const hasChildren = nodes.some((n) => n.parentId === id)
    const message = hasChildren
      ? `Excluir "${node?.title}" e todos os subtópicos dentro dele?`
      : `Excluir "${node?.title}"?`
    if (!window.confirm(message)) return
    void deleteBoard(id)
    if (boardId === id) navigate('/')
  }

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-hairline bg-surface">
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-series-1/10 text-series-1">
          <Brain size={16} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-ink">BrainPath</span>
      </div>

      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Tópicos</span>
        <button
          type="button"
          onClick={() => handleCreate(null)}
          className="flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
          title="Novo tópico"
        >
          <Plus size={14} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {roots.length === 0 ? (
          <p className="px-2 py-4 text-xs text-ink-muted">Nenhum tópico ainda. Crie o primeiro com o botão “+”.</p>
        ) : (
          roots.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              allNodes={nodes}
              depth={0}
              activeId={boardId ?? null}
              editingId={editingId}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
              onSelect={(id) => navigate(`/board/${id}`)}
              onCreateChild={handleCreate}
              onRename={renameBoard}
              onStartRename={setEditingId}
              onCancelRename={() => setEditingId(null)}
              onDelete={handleDelete}
            />
          ))
        )}
      </nav>

      <div className="flex items-center justify-between border-t border-hairline px-4 py-3">
        <span className="min-w-0 flex-1 truncate text-xs text-ink-muted" title={user?.email ?? ''}>
          {user?.email}
        </span>
        <button
          type="button"
          onClick={toggle}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
          title="Alternar tema"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <button
          type="button"
          onClick={() => signOut(auth)}
          className="flex h-7 w-7 items-center justify-center rounded text-ink-muted hover:bg-ink/10 hover:text-ink"
          title="Sair"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
