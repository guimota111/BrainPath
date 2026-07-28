import type { Timestamp } from 'firebase/firestore'
import type { JSONContent } from '@tiptap/react'

export interface WidgetLayout {
  x: number
  y: number
  w: number
  h: number
}

export interface BaseWidget {
  id: string
  boardId: string
  layout: WidgetLayout
  title?: string
  /** channel names this widget listens to */
  linkedTo?: string[]
  /** channel this widget broadcasts on interaction (defaults to its own id) */
  emits?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface DataPoint {
  key: string
  label: string
  value: number
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export type Widget =
  | (BaseWidget & { type: 'note'; content: JSONContent })
  | (BaseWidget & { type: 'flashcard'; question: string; answer: string })
  | (BaseWidget & { type: 'checklist'; items: ChecklistItem[] })
  | (BaseWidget & { type: 'table'; columns: string[]; rows: Record<string, string>[] })
  | (BaseWidget & { type: 'pie'; data: DataPoint[] })
  | (BaseWidget & { type: 'bar'; data: DataPoint[] })
  | (BaseWidget & { type: 'heatmap'; rows: string[]; cols: string[]; values: number[][] })
  | (BaseWidget & { type: 'icon'; icon: string; label: string; revealContent?: string })

export type WidgetType = Widget['type']

export type NewWidget = Omit<Widget, 'id' | 'createdAt' | 'updatedAt'>
