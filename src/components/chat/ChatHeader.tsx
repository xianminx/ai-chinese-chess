import React from 'react';
import CloseIcon from '../icons/CloseIcon';

interface ChatHeaderProps {
  isThinking: boolean;
  onClose: () => void;
}

export default function ChatHeader({ isThinking, onClose }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-lg">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">AI 助手</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {isThinking ? '思考中...' : '在线'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
} 