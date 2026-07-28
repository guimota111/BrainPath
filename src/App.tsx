import { BrowserRouter } from 'react-router-dom'
import { AuthGate } from './features/auth/AuthGate'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthGate>
        <AppRoutes />
      </AuthGate>
    </BrowserRouter>
  )
}

export default App
