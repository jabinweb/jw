"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { Button } from "@/components/ui/button"
import { 
  Bold, Italic, Link as LinkIcon, List, ListOrdered, 
  Quote, Heading1, Heading2, Redo, Undo, Code, ImageIcon
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { useCallback, useState, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  // Using a state to prevent issues with initial rendering
  const [editorReady, setEditorReady] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-2 hover:text-primary/80',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full mx-auto',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Set content after editor is ready
  useEffect(() => {
    if (editor && content && !editorReady) {
      editor.commands.setContent(content)
      setEditorReady(true)
    }
  }, [editor, content, editorReady])

  const toggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run()
  }, [editor])

  const toggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run()
  }, [editor])

  const toggleLink = useCallback(() => {
    const url = window.prompt('URL')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    } else {
      editor?.chain().focus().unsetLink().run()
    }
  }, [editor])

  const toggleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const toggleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  const toggleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run()
  }, [editor])

  const toggleHeading1 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }, [editor])

  const toggleHeading2 = useCallback(() => {
    editor?.chain().focus().toggleHeading({ level: 2 }).run()
  }, [editor])

  const toggleCodeBlock = useCallback(() => {
    editor?.chain().focus().toggleCodeBlock().run()
  }, [editor])
  
  const addImage = useCallback(() => {
    const url = window.prompt('Image URL')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className="border rounded-md min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/20">
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleBold}
          className={cn(editor.isActive('bold') && 'bg-muted')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleItalic}
          className={cn(editor.isActive('italic') && 'bg-muted')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleLink}
          className={cn(editor.isActive('link') && 'bg-muted')}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleHeading1}
          className={cn(editor.isActive('heading', { level: 1 }) ? 'bg-muted' : '')}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleHeading2}
          className={cn(editor.isActive('heading', { level: 2 }) && 'bg-muted')}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleBulletList}
          className={cn(editor.isActive('bulletList') && 'bg-muted')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleOrderedList}
          className={cn(editor.isActive('orderedList') && 'bg-muted')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleBlockquote}
          className={cn(editor.isActive('blockquote') && 'bg-muted')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={toggleCodeBlock}
          className={cn(editor.isActive('codeBlock') && 'bg-muted')}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={addImage}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[300px]" />
    </div>
  )
}
