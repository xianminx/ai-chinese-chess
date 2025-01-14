import React from 'react';
import Image from "next/image";
import { Message } from './types';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`px-2 py-2 ${
            message.role === "assistant" 
              ? "bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700" 
              : "bg-gray-50 dark:bg-gray-900"
          }`}
        >
          <div className="max-w-[100%] mx-auto flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <Image
                src={message.role === "user" ? "/icons/anonymous.svg" : "/icons/openai.svg"}
                alt={message.role}
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-medium text-sm text-gray-500 dark:text-gray-400">
                {message.role === "user" ? "你" : "AI 助手"}
              </div>
              <div className="text-gray-700 dark:text-gray-300 text-sm prose prose-sm dark:prose-invert max-w-none">
                <MarkdownRenderer content={message.content} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
} 