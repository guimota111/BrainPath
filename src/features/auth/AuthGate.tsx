import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from './useAuth'
import { LoginScreen } from './LoginScreen'

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <Loader2 className="animate-spin text-ink-muted" size={24} />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return children
}
