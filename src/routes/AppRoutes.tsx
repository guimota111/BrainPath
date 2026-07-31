import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { HomePage } from '../pages/HomePage'
import { TopicPage } from '../pages/TopicPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="tema/:slug" element={<TopicPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}
