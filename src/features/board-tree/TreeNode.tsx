import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import type { BoardNode } from '../../types/board'

interface TreeNodeProps {
  node: BoardNode
  allNodes: BoardNode[]
  depth: number
  activeId: string | null
  editingId: string | null
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onSelect: (id: string) => void
  onCreateChild: (parentId: string) => void
  onRename: (id: string, title: string) => void
  onStartRename: (id: string) => void
  onCancelRename: () => void
  onDelete: (id: string) => void
}

export function TreeNode({
  node,
  allNodes,
  depth,
  activeId,
  editingId,
  expandedIds,
  onToggleExpand,
  onSelect,
  onCreateChild,
  onRename,
  onStartRename,
  onCancelRename,
  onDelete,
}: TreeNodeProps) {
  const children = allNodes.filter((n) => n.parentId === node.id)
  const hasChildren = children.length > 0
  const expanded = expandedIds.has(node.id)
  const isEditing = editingId === node.id
  const [draft, setDraft] = useState(node.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setDraft(node.title)
      requestAnimationFrame(() => inputRef.current?.select())
    }
  }, [isEditing, node.title])

  function commitRename() {
    const title = draft.trim()
    if (title && title !== node.title) onRename(node.id, title)
    onCancelRename()
  }

  return (
    <div>
      <div
        className={clsx(
          'group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition',
          activeId === node.id ? 'bg-ink/8 text-ink font-medium' : 'text-ink-secondary hover:bg-ink/5',
        )}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <button
          type="button"
          onClick={() => onToggleExpand(node.id)}
          className={clsx('flex h-4 w-4 shrink-0 items-center justify-center text-ink-muted', !hasChildren && 'invisible')}
        >
          <ChevronRight size={12} className={clsx('transition-transform', expanded && 'rotate-90')} />
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') onCancelRename()
            }}
            className="min-w-0 flex-1 rounded border border-series-1 bg-surface px-1 py-0.5 text-sm outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            onDoubleClick={() => onStartRename(node.id)}
            className="min-w-0 flex-1 truncate text-left"
            title={node.title}
          >
            {node.title}
          </button>
        )}

        <button
          type="button"
          onClick={() => onCreateChild(node.id)}
          className="hidden h-5 w-5 shrink-0 items-center justify-center rounded text-ink-muted hover:bg-ink/10 group-hover:flex"
          title="Adicionar subtópico"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="hidden h-5 w-5 shrink-0 items-center justify-center rounded text-ink-muted hover:bg-status-critical/10 hover:text-status-critical group-hover:flex"
          title="Excluir"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {hasChildren && expanded ? (
        <div>
          {children
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                allNodes={allNodes}
                depth={depth + 1}
                activeId={activeId}
                editingId={editingId}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
                onCreateChild={onCreateChild}
                onRename={onRename}
                onStartRename={onStartRename}
                onCancelRename={onCancelRename}
                onDelete={onDelete}
              />
            ))}
        </div>
      ) : null}
    </div>
  )
}
