import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type SceneValue = string | null
type SceneUpdater = SceneValue | ((current: SceneValue) => SceneValue)

/**
 * Regra 5 do projeto: o estado visível de um artifact mora na URL.
 *
 * Hotspot aberto, camada ativa e filtros de bancada viram query params, o que dá
 * de graça as duas coisas que um site de consulta precisa: link que abre no ponto
 * exato e botão voltar que desfaz passo a passo.
 *
 * Toda escrita parte de `window.location.search`, e não do valor do último
 * render. Dois cliques antes de um novo render — comum ao declarar dois
 * marcadores seguidos — fariam o segundo apagar o efeito do primeiro; a URL do
 * navegador, essa, está sempre atualizada.
 */
export function useSceneState(key: string, fallback: SceneValue = null) {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback

  const setValue = useCallback(
    (next: SceneUpdater, options?: { replace?: boolean }) => {
      const draft = new URLSearchParams(window.location.search)
      const resolved = typeof next === 'function' ? next(draft.get(key)) : next
      if (resolved === null) draft.delete(key)
      else draft.set(key, resolved)
      setParams(draft, { replace: options?.replace ?? false })
    },
    [key, setParams],
  )

  return [value, setValue] as const
}
