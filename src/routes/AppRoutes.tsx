import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { BoardPage } from '../features/board/BoardPage'
import { EmptyBoardPrompt } from '../features/board/EmptyBoardPrompt'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<EmptyBoardPrompt />} />
        <Route path="board/:boardId" element={<BoardPage />} />
      </Route>
    </Routes>
  )
}
