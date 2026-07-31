import type { CSSProperties } from 'react'
import type { AccentToken } from '../content/schema'

/**
 * Cada cena escolhe uma cor de acento e a publica como `--accent`. Os artifacts
 * dentro dela leem essa variável em vez de conhecer a paleta, então a mesma peça
 * serve a qualquer tema sem receber cor por prop.
 */
export function accentStyle(token: AccentToken): CSSProperties {
  return { '--accent': `var(--color-${token})` } as CSSProperties
}
