import type { Widget } from '../types/widget'
import type { WidgetDescriptor } from './types'
import { noteWidget } from './note'
import { flashcardWidget } from './flashcard'
import { checklistWidget } from './checklist'
import { tableWidget } from './table'
import { pieWidget } from './pie'
import { barWidget } from './bar'
import { heatmapWidget } from './heatmap'
import { iconWidget } from './icon'

export const widgetRegistry: Record<Widget['type'], WidgetDescriptor<any>> = {
  note: noteWidget,
  flashcard: flashcardWidget,
  checklist: checklistWidget,
  table: tableWidget,
  pie: pieWidget,
  bar: barWidget,
  heatmap: heatmapWidget,
  icon: iconWidget,
}

export const widgetList = Object.values(widgetRegistry)
