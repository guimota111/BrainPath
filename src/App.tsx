import { useState } from 'react'
import { Tldraw } from '@tldraw/tldraw'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './App.css'
import './firebase'

const initialDocument = {
  id: 'root',
  type: 'document',
  children: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Escreva suas notas aqui...' }],
    },
  ],
}

function App() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'notes'>('canvas')
  const [selectedTopic] = useState('2026 > Hematologia')
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialDocument,
    autofocus: 'end',
  })

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">BrainPath</div>
        <nav className="subject-tree">
          <button className="tree-node active">2026</button>
          <button className="tree-node">Hematologia</button>
          <button className="tree-node">Patologia Geral</button>
          <button className="tree-node">Imunologia</button>
        </nav>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="breadcrumb">Ano 2026 / Hematologia / LMA</p>
            <h1>{selectedTopic}</h1>
          </div>
          <div className="workspace-actions">
            <button>Salvar</button>
          </div>
        </header>

        <section className="workspace-tabs">
          <button
            className={activeTab === 'canvas' ? 'active' : ''}
            onClick={() => setActiveTab('canvas')}
          >
            Artefatos
          </button>
          <button
            className={activeTab === 'notes' ? 'active' : ''}
            onClick={() => setActiveTab('notes')}
          >
            Notas
          </button>
        </section>

        <section className="workspace-panel">
          {activeTab === 'canvas' ? (
            <div className="canvas-panel">
              <div className="canvas-toolbar">Canvas visual – arraste, redimensione, edite.</div>
              <div className="canvas-frame">
                <Tldraw />
              </div>
            </div>
          ) : (
            <div className="notes-panel">
              <div className="notes-toolbar">Notas em Markdown / rich-text.</div>
              <div className="notes-editor">
                {editor ? <EditorContent editor={editor} /> : null}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
