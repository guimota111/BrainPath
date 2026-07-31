import { BrowserRouter } from 'react-router-dom'
import { StudyModeProvider } from './lib/StudyModeProvider'
import { AppRoutes } from './routes/AppRoutes'

/**
 * O roteador herda o prefixo do Vite em vez de repetir a string: mudar o destino
 * de publicação passa a ser mexer só no `base` do vite.config.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  return (
    <BrowserRouter basename={basename}>
      <StudyModeProvider>
        <AppRoutes />
      </StudyModeProvider>
    </BrowserRouter>
  )
}

export default App
