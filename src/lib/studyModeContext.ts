import { createContext, useContext } from 'react'

export interface StudyModeValue {
  /**
   * Regra 4 do projeto. Ligado, todo elemento que tem `probe` pergunta antes de
   * contar: o clique vira tentativa de recuperação em vez de acordeão.
   */
  training: boolean
  toggleTraining: () => void
}

export const StudyModeContext = createContext<StudyModeValue>({
  training: false,
  toggleTraining: () => {},
})

export function useStudyMode() {
  return useContext(StudyModeContext)
}
