import { Outlet } from 'react-router-dom'
import { Sidebar } from '../features/board-tree/Sidebar'

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-page">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
