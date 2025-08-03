'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Pilcrow,
  CornerDownLeft,
  WrapText
} from 'lucide-react'

interface PoemEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function PoemEditor({ content, onChange, placeholder }: PoemEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        },
        hardBreak: {
          keepMarks: false
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 [&_p]:mb-2 [&_br]:content-[""] [&_p:empty::before]:content-["\\00a0"]'
      },
      handleKeyDown: (view, event) => {
        // Convert Enter to line break instead of paragraph for poetry
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          editor?.chain().focus().setHardBreak().run()
          return true
        }
        return false
      }
    }
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('bold') ? 'bg-muted' : ''
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('italic') ? 'bg-muted' : ''
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <div className="w-px bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''
          }`}
          title="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('paragraph') ? 'bg-muted' : ''
          }`}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </button>
        
        <div className="w-px bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('bulletList') ? 'bg-muted' : ''
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive('orderedList') ? 'bg-muted' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        
        <div className="w-px bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-muted ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        
        <div className="w-px bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="p-2 rounded hover:bg-muted"
          title="Setir aýry (Line break)"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => {
            // Insert paragraph break
            editor.chain().focus().enter().run()
          }}
          className="p-2 rounded hover:bg-muted"
          title="Abzas aýry (Paragraph break)"
        >
          <WrapText className="h-4 w-4" />
        </button>
        
        <div className="w-px bg-border mx-1" />
        
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-muted disabled:opacity-50"
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-muted disabled:opacity-50"
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  )
}