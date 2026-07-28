import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'brainpath-theme'

function getStored(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(() => getStored())

  useEffect(() => {
    const root = document.documentElement
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
  }, [theme])

  function setTheme(next: Theme | null) {
    setThemeState(next)
    if (next) localStorage.setItem(STORAGE_KEY, next)
    else localStorage.removeItem(STORAGE_KEY)
  }

  function toggle() {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const current = theme ?? (systemDark ? 'dark' : 'light')
    setTheme(current === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggle }
}
