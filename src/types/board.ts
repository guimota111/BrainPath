import type { Timestamp } from 'firebase/firestore'

export interface BoardNode {
  id: string
  ownerUid: string
  parentId: string | null
  title: string
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type NewBoardNode = Omit<BoardNode, 'id' | 'createdAt' | 'updatedAt'>
