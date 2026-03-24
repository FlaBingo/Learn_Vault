// src\components\TiptapEditor.tsx

"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Code, Redo, Undo, Sigma // Added Sigma icon
} from 'lucide-react';
import Mathematics from '@tiptap/extension-mathematics';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mathematics.configure({
        // This handles $inline$ and $$block$$ math automatically
        katexOptions: {
          throwOnError: false,
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert focus:outline-none min-h-[150px] p-3 border rounded-md bg-background prose-p:mb-4',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const btnClass = (activeName: string) => `p-2 rounded transition-colors ${
    editor.isActive(activeName) 
    ? 'bg-primary text-primary-foreground' 
    : 'hover:bg-muted text-muted-foreground'
  }`;

  return (
    <div className="flex flex-col w-full border rounded-md bg-background relative">
      <div className="sticky top-0 z-20 flex flex-wrap gap-1 p-1 bg-background border-b">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass('bold')}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass('italic')}>
          <Italic size={16} />
        </button>
        
        {/* Math Formula Button */}
        <button 
          type="button" 
          onClick={() => editor.chain().focus().insertContent('$ $').run()} 
          className="p-2 hover:bg-muted text-teal-600"
          title="Doesn't work for now..."
        >
          <Sigma size={16} />
        </button>

        <div className="w-[1px] h-6 bg-border mx-1 self-center" />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass('bulletList')}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass('orderedList')}>
          <ListOrdered size={16} />
        </button>
        
        <div className="w-[1px] h-6 bg-border mx-1 self-center" />
        
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass('blockquote')}>
          <Quote size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass('code')}>
          <Code size={16} />
        </button>
        
        <div className="flex-1" />
        
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 hover:text-primary">
          <Undo size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 hover:text-primary">
          <Redo size={16} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;