import { useEffect, useState } from 'react'
import type { Depth } from '../content/schema'
import { useStudyMode } from '../lib/studyModeContext'

export type DepthStage = 'probe' | 'brief' | 'detail'

/**
 * A mecânica L1→L2→L3, isolada da apresentação.
 *
 * Os três artifacts desenham a revelação de formas diferentes — bolha ancorada,
 * popover de célula, coluna lateral — mas todos avançam pelos mesmos estágios,
 * o que faz o site inteiro responder ao clique da mesma maneira.
 */
export function useDisclosure(depth: Depth) {
  const { training } = useStudyMode()
  const gated = training && Boolean(depth.probe)
  const [revealed, setRevealed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Trocar de elemento (ou ligar o modo treino) devolve a revelação ao início.
  useEffect(() => {
    setRevealed(false)
    setExpanded(false)
  }, [depth, training])

  const stage: DepthStage = gated && !revealed ? 'probe' : expanded ? 'detail' : 'brief'

  return {
    stage,
    hasDetail: (depth.detail?.length ?? 0) > 0,
    reveal: () => setRevealed(true),
    toggleDetail: () => setExpanded((v) => !v),
  }
}
