import { useState } from 'react'
import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { Widget } from '../../types/widget'

type IconWidget = Extract<Widget, { type: 'icon' }>

const ICON_NAMES = [
  'BookOpen', 'Brain', 'Heart', 'Activity', 'Stethoscope', 'Pill', 'Syringe', 'TestTube',
  'Microscope', 'FlaskConical', 'Dna', 'Bone', 'Eye', 'Ear', 'Bug', 'ShieldAlert',
  'AlertTriangle', 'CheckCircle2', 'XCircle', 'Info', 'Star', 'Flag', 'Target', 'Clock',
  'Calendar', 'FileText', 'Lightbulb', 'Zap', 'Droplet', 'Thermometer', 'Users', 'User',
  'MapPin', 'Tag', 'Bookmark', 'Folder', 'Waves', 'Wind', 'Sun', 'Moon',
] as const

function getIcon(name: string): LucideIcon {
  const icon = (Icons as unknown as Record<string, LucideIcon>)[name]
  return icon ?? Icons.HelpCircle
}

function IconView({ widget, selections, onSelect, onChange }: WidgetViewProps<IconWidget>) {
  const [picking, setPicking] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const Icon = getIcon(widget.icon)
  const channel = widget.emits ?? widget.id
  const active = selections[channel] === widget.id

  if (picking) {
    return (
      <div className="flex h-full flex-col gap-2">
        <div className="grid flex-1 grid-cols-6 gap-1 overflow-y-auto">
          {ICON_NAMES.map((name) => {
            const Opt = getIcon(name)
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange({ icon: name })
                  setPicking(false)
                }}
                className={clsx(
                  'flex aspect-square items-center justify-center rounded-lg text-ink-secondary hover:bg-ink/10',
                  widget.icon === name && 'bg-series-1/15 text-series-1',
                )}
              >
                <Opt size={16} />
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => setPicking(false)} className="self-end text-xs text-ink-muted hover:text-ink">
          Fechar
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <button
        type="button"
        onClick={() => setPicking(true)}
        className={clsx(
          'flex h-12 w-12 items-center justify-center rounded-full transition',
          active ? 'bg-series-1/15 text-series-1' : 'bg-page text-ink-secondary hover:bg-ink/10',
        )}
        title="Trocar ícone"
      >
        <Icon size={22} />
      </button>
      <input
        value={widget.label}
        onChange={(e) => onChange({ label: e.target.value })}
        className="w-full bg-transparent text-center text-sm font-medium text-ink outline-none"
      />
      {widget.revealContent ? (
        <button
          type="button"
          onClick={() => {
            setRevealed((v) => !v)
            onSelect(channel, widget.id)
          }}
          className="text-[11px] text-series-1 hover:underline"
        >
          {revealed ? 'Ocultar detalhe' : 'Ver detalhe'}
        </button>
      ) : null}
      {revealed && widget.revealContent ? <p className="text-xs text-ink-secondary">{widget.revealContent}</p> : null}
      {!revealed ? (
        <textarea
          value={widget.revealContent ?? ''}
          onChange={(e) => onChange({ revealContent: e.target.value })}
          placeholder="Texto revelado ao clicar (opcional)"
          rows={2}
          className="w-full resize-none rounded border border-hairline bg-page px-1.5 py-1 text-[11px] text-ink outline-none placeholder:text-ink-muted"
        />
      ) : null}
    </div>
  )
}

export const iconWidget: WidgetDescriptor<IconWidget> = {
  type: 'icon',
  label: 'Ícone',
  group: 'Conteúdo',
  icon: Icons.Sparkles,
  defaultLayout: { x: 0, y: 0, w: 3, h: 4 },
  createDefault: (boardId) => ({
    boardId,
    type: 'icon',
    layout: { x: 0, y: 0, w: 3, h: 4 },
    title: 'Ícone',
    icon: 'Star',
    label: 'Rótulo',
  }),
  View: IconView,
}
