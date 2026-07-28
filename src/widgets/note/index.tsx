import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { NotebookText } from 'lucide-react'
import type { WidgetDescriptor, WidgetViewProps } from '../types'
import type { Widget } from '../../types/widget'

type NoteWidget = Extract<Widget, { type: 'note' }>

function NoteView({ widget, onChange }: WidgetViewProps<NoteWidget>) {
  const debounceRef = useRef<number | undefined>(undefined)
  const [isEmpty, setIsEmpty] = useState(true)
  const editor = useEditor({
    extensions: [StarterKit],
    content: widget.content,
    onCreate: ({ editor: instance }) => setIsEmpty(instance.isEmpty),
    onUpdate: ({ editor: instance }) => {
      setIsEmpty(instance.isEmpty)
      window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(() => {
        onChange({ content: instance.getJSON() })
      }, 600)
    },
  })

  useEffect(() => () => window.clearTimeout(debounceRef.current), [])

  return (
    <div className="note-content relative h-full overflow-y-auto text-sm leading-relaxed text-ink-secondary [&_.tiptap]:h-full [&_.tiptap]:outline-none [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-ink [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-ink [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-1.5 [&_ul]:list-disc [&_ul]:pl-4">
      {isEmpty ? <p className="pointer-events-none absolute left-0 top-0 text-ink-muted">Escreva suas notas aqui…</p> : null}
      {editor ? <EditorContent editor={editor} /> : null}
    </div>
  )
}

export const noteWidget: WidgetDescriptor<NoteWidget> = {
  type: 'note',
  label: 'Nota',
  group: 'Conteúdo',
  icon: NotebookText,
  defaultLayout: { x: 0, y: 0, w: 4, h: 4 },
  createDefault: (boardId) => ({
    boardId,
    type: 'note',
    layout: { x: 0, y: 0, w: 4, h: 4 },
    title: 'Nota',
    content: { type: 'doc', content: [{ type: 'paragraph' }] },
  }),
  View: NoteView,
}
