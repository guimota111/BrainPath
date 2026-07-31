import { BrowserRouter } from 'react-router-dom'
import { StudyModeProvider } from './lib/StudyModeProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <StudyModeProvider>
        <AppRoutes />
      </StudyModeProvider>
    </BrowserRouter>
  )
}

export default App
