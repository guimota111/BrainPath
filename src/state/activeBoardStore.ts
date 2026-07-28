import { create } from 'zustand'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { NewWidget, Widget, WidgetLayout } from '../types/widget'

interface ActiveBoardState {
  boardId: string | null
  widgets: Widget[]
  loading: boolean
  selections: Record<string, string | null>
  unsubscribe: (() => void) | null

  open: (boardId: string) => void
  close: () => void
  addWidget: (widget: NewWidget) => Promise<void>
  updateWidget: (widgetId: string, patch: Record<string, unknown>) => Promise<void>
  deleteWidget: (widgetId: string) => Promise<void>
  updateLayouts: (layouts: { id: string; layout: WidgetLayout }[]) => Promise<void>
  select: (channel: string, value: string | null) => void
}

export const useActiveBoardStore = create<ActiveBoardState>((set, get) => ({
  boardId: null,
  widgets: [],
  loading: true,
  selections: {},
  unsubscribe: null,

  open: (boardId) => {
    get().unsubscribe?.()
    set({ boardId, widgets: [], loading: true, selections: {} })
    const unsubscribe = onSnapshot(collection(db, 'boards', boardId, 'widgets'), (snapshot) => {
      const widgets = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Widget)
      set({ widgets, loading: false })
    })
    set({ unsubscribe })
  },

  close: () => {
    get().unsubscribe?.()
    set({ boardId: null, widgets: [], loading: true, selections: {}, unsubscribe: null })
  },

  addWidget: async (widget) => {
    const { boardId } = get()
    if (!boardId) return
    await addDoc(collection(db, 'boards', boardId, 'widgets'), {
      ...widget,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  },

  updateWidget: async (widgetId, patch) => {
    const { boardId } = get()
    if (!boardId) return
    await updateDoc(doc(db, 'boards', boardId, 'widgets', widgetId), {
      ...patch,
      updatedAt: serverTimestamp(),
    })
  },

  deleteWidget: async (widgetId) => {
    const { boardId } = get()
    if (!boardId) return
    await deleteDoc(doc(db, 'boards', boardId, 'widgets', widgetId))
  },

  updateLayouts: async (layouts) => {
    const { boardId } = get()
    if (!boardId || layouts.length === 0) return
    const batch = writeBatch(db)
    for (const { id, layout } of layouts) {
      batch.update(doc(db, 'boards', boardId, 'widgets', id), { layout, updatedAt: serverTimestamp() })
    }
    await batch.commit()
  },

  select: (channel, value) => {
    set((state) => ({
      selections: {
        ...state.selections,
        [channel]: state.selections[channel] === value ? null : value,
      },
    }))
  },
}))
