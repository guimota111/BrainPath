import { create } from 'zustand'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { BoardNode } from '../types/board'

interface BoardTreeState {
  nodes: BoardNode[]
  loading: boolean
  unsubscribe: (() => void) | null
  subscribe: (ownerUid: string) => void
  stop: () => void
  createBoard: (ownerUid: string, title: string, parentId: string | null) => Promise<string>
  renameBoard: (id: string, title: string) => Promise<void>
  deleteBoard: (id: string) => Promise<void>
}

export const useBoardTreeStore = create<BoardTreeState>((set, get) => ({
  nodes: [],
  loading: true,
  unsubscribe: null,

  subscribe: (ownerUid) => {
    get().unsubscribe?.()
    const q = query(collection(db, 'boards'), where('ownerUid', '==', ownerUid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nodes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BoardNode)
      nodes.sort((a, b) => a.order - b.order)
      set({ nodes, loading: false })
    })
    set({ unsubscribe })
  },

  stop: () => {
    get().unsubscribe?.()
    set({ unsubscribe: null, nodes: [], loading: true })
  },

  createBoard: async (ownerUid, title, parentId) => {
    const siblingCount = get().nodes.filter((n) => n.parentId === parentId).length
    const ref = await addDoc(collection(db, 'boards'), {
      ownerUid,
      title,
      parentId,
      order: siblingCount,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  },

  renameBoard: async (id, title) => {
    await updateDoc(doc(db, 'boards', id), { title, updatedAt: serverTimestamp() })
  },

  deleteBoard: async (id) => {
    const all = get().nodes
    const idsToDelete: string[] = []
    const collectDescendants = (nodeId: string) => {
      idsToDelete.push(nodeId)
      all.filter((n) => n.parentId === nodeId).forEach((child) => collectDescendants(child.id))
    }
    collectDescendants(id)

    const batch = writeBatch(db)
    for (const boardId of idsToDelete) {
      const widgetsSnapshot = await getDocs(collection(db, 'boards', boardId, 'widgets'))
      widgetsSnapshot.docs.forEach((widgetDoc) => batch.delete(widgetDoc.ref))
      batch.delete(doc(db, 'boards', boardId))
    }
    await batch.commit()
  },
}))
