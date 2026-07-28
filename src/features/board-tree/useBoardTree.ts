import { useEffect } from 'react'
import { useBoardTreeStore } from '../../state/boardTreeStore'
import { useAuth } from '../auth/useAuth'

export function useBoardTree() {
  const { user } = useAuth()
  const nodes = useBoardTreeStore((s) => s.nodes)
  const loading = useBoardTreeStore((s) => s.loading)
  const subscribe = useBoardTreeStore((s) => s.subscribe)
  const stop = useBoardTreeStore((s) => s.stop)
  const storeCreateBoard = useBoardTreeStore((s) => s.createBoard)
  const renameBoard = useBoardTreeStore((s) => s.renameBoard)
  const deleteBoard = useBoardTreeStore((s) => s.deleteBoard)

  useEffect(() => {
    if (!user) return
    subscribe(user.uid)
    return () => stop()
  }, [user, subscribe, stop])

  async function createBoard(title: string, parentId: string | null) {
    if (!user) throw new Error('not authenticated')
    return storeCreateBoard(user.uid, title, parentId)
  }

  return { nodes, loading, createBoard, renameBoard, deleteBoard }
}
