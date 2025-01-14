import React, { useRef, useEffect } from 'react';
import SendIcon from '../icons/SendIcon';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isThinking: boolean;
}

export default function ChatInput({ input, setInput, onSubmit, isThinking }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
      <form onSubmit={onSubmit} className="relative flex items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="发送消息给 AI 助手..."
          rows={1}
          className="w-full pr-24 py-2 px-3 text-sm text-gray-700 dark:text-gray-200 
                   bg-gray-50 dark:bg-gray-700 rounded-lg 
                   border border-gray-200 dark:border-gray-600 
                   focus:outline-none focus:border-gray-300 dark:focus:border-gray-500
                   resize-none min-h-[40px] max-h-[120px]
                   placeholder-gray-500 dark:placeholder-gray-400"
          disabled={isThinking}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {isThinking ? "思考中..." : "Enter 发送"}
          </span>
          <button
            type="submit"
            disabled={isThinking}
            className="p-1.5 rounded-md bg-gray-700 dark:bg-gray-600 text-white 
                     hover:bg-gray-600 dark:hover:bg-gray-500
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
} 