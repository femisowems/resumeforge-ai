"use client";

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import toast from 'react-hot-toast';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  X,
  Highlighter,
  Minus,
  Save
} from 'lucide-react';

interface ResumeEditorProps {
  content: string;
  onChange: (markdown: string) => void;
  onSave?: (markdown: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
      <div className="flex items-center gap-0.5 mr-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('underline') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('highlight') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Skill Badge (Highlight)"
        >
          <Highlighter className="w-4 h-4" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <div className="flex items-center gap-0.5 mx-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="H1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="H2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="H3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <div className="flex items-center gap-0.5 mx-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-md transition-colors ${editor.isActive('blockquote') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded-md text-slate-400 hover:bg-slate-800 transition-colors"
          title="Horizontal Rule"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <div className="w-[1px] h-4 bg-slate-700 mx-1" />

      <button
        onClick={addLink}
        className={`p-2 rounded-md transition-colors ${editor.isActive('link') ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
        title="Add Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ResumeEditor = ({ content, onChange, onSave }: ResumeEditorProps) => {
  const saveContent = (editor: any) => {
    const markdown = (editor.storage as any).markdown.getMarkdown();
    onChange(markdown);
    if (onSave) onSave(markdown);
    toast.success('Progress saved', { icon: '💾', style: { background: '#1e293b', color: '#fff', fontSize: '12px' } });
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        // HardBreak is included by default in StarterKit, no need to explicitly add unless configuring
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your resume optimized text...',
      }),
      Markdown.configure({
        html: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      HorizontalRule,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Get markdown directly from the markdown extension
      const markdown = (editor.storage as any).markdown.getMarkdown();
      onChange(markdown);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none p-8 focus:outline-none min-h-full font-sans text-slate-300 whitespace-pre-wrap',
      },
      handleKeyDown: (view, event) => {
        // Handle Ctrl+S or Cmd+S
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault();
          if (editor) { // Ensure editor is available
            saveContent(editor);
          }
          return true;
        }

        // Handle Tab key
        if (event.key === 'Tab') {
          event.preventDefault();
          view.dispatch(view.state.tr.insertText('\t'));
          return true;
        }

        return false;
      },
    },
    // Only update content if it's externally changed and different from current content
    // to avoid cursor jumping
  });

  // Watch for external content changes (e.g. from AI)
  React.useEffect(() => {
    if (editor && content !== (editor.storage as any).markdown.getMarkdown()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-auto custom-scrollbar bg-slate-900/40">
        <EditorContent editor={editor} className="h-full" />
      </div>
      
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #64748b;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #cbd5e1; }
        .ProseMirror h3 { font-size: 1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.25rem; color: #94a3b8; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .ProseMirror blockquote { border-left: 4px solid #4f46e5; padding-left: 1rem; font-style: italic; color: #94a3b8; margin: 1.5rem 0; background: rgba(79, 70, 229, 0.05); padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0 0.375rem 0.375rem 0; }
        .ProseMirror a { color: #6366f1; text-decoration: underline; cursor: pointer; }
        .ProseMirror mark { 
          background-color: #e0e7ff; 
          color: #4338ca; 
          padding: 0.1em 0.5em; 
          border-radius: 9999px; 
          font-weight: 600; 
          margin: 0 0.1em;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #334155;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default ResumeEditor;
