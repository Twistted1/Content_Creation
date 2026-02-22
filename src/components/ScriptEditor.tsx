import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback, useEffect } from 'react';
import { scriptService } from '@/services/scriptService';
import { showToast } from '@/utils/toast';

interface ScriptEditorProps {
  initialContent?: string;
  onUpdate?: (content: string, wordCount: number) => void;
  isGenerating?: boolean;
}

export const ScriptEditor = ({
  initialContent = '',
  onUpdate,
  isGenerating = false
}: ScriptEditorProps) => {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your script here, or press / to use AI commands...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      setWordCount(words);
      if (onUpdate) {
        onUpdate(html, words);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none min-h-[400px] max-w-none text-gray-900 dark:text-white',
      },
    },
  });

  // Update content when initialContent changes (e.g. from AI generation)
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
        // Only set content if it's significantly different to avoid cursor jumping
        // or if editor is empty
        if (editor.isEmpty || isGenerating) {
             editor.commands.setContent(initialContent);
        }
    }
  }, [initialContent, editor, isGenerating]);

  if (!editor) {
    return null;
  }

  const estimatedMinutes = Math.round(wordCount / 150);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Toolbar could go here */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button 
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
        >
            <i className="fas fa-bold"></i>
        </button>
        <button 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
        >
            <i className="fas fa-italic"></i>
        </button>
        <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
        >
            <i className="fas fa-heading"></i>
        </button>
        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600 text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300'}`}
        >
            <i className="fas fa-list-ul"></i>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>
          {wordCount} words · ~{estimatedMinutes || '< 1'} min read · 150 wpm
        </span>
        <span className="flex items-center gap-1">
            {isGenerating && <span className="animate-pulse text-purple-500">AI Writing...</span>}
        </span>
      </div>
    </div>
  );
};
