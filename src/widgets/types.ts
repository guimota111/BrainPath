import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { NewWidget, Widget, WidgetLayout } from '../types/widget'

export interface WidgetViewProps<TWidget extends Widget = Widget> {
  widget: TWidget
  selections: Record<string, string | null>
  onSelect: (channel: string, value: string | null) => void
  onChange: (patch: Record<string, unknown>) => void
}

export interface WidgetDescriptor<TWidget extends Widget = Widget> {
  type: TWidget['type']
  label: string
  group: 'Conteúdo' | 'Dados & Gráficos' | 'Estudo'
  icon: LucideIcon
  defaultLayout: WidgetLayout
  createDefault: (boardId: string) => NewWidget
  View: ComponentType<WidgetViewProps<TWidget>>
}
