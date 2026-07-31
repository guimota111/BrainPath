import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { StudyModeContext } from './studyModeContext'

const STORAGE_KEY = 'brainpath-training'

export function StudyModeProvider({ children }: { children: ReactNode }) {
  const [training, setTraining] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, training ? '1' : '0')
  }, [training])

  const toggleTraining = useCallback(() => setTraining((v) => !v), [])
  const value = useMemo(() => ({ training, toggleTraining }), [training, toggleTraining])

  return <StudyModeContext.Provider value={value}>{children}</StudyModeContext.Provider>
}
