"use client";
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/lib/chatService";
import { Message } from './types';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import ChatIcon from '../icons/ChatIcon';
import { BoardState } from "@/lib/engine/types";


interface ChatComponentProps {
  state: BoardState;
  isThinking: boolean;
} 

export default function ChatComponent({ state, isThinking }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    try {
      const response = await sendChatMessage(input, state);
      
      if (response.success && response.message) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: response.message,
          timestamp: response.timestamp ? new Date(response.timestamp) : new Date(),
        };
        
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(response.error || "Failed to get AI response");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Error: ${errorMessage}`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-2">
      <div
        className={`${
          isCollapsed ? 'hidden' : 'flex'
        } flex-col w-80 sm:w-[440px] h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-200 ease-in-out border border-gray-200 dark:border-gray-700`}
      >
        <ChatHeader isThinking={isThinking} onClose={() => setIsCollapsed(true)} />
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isThinking={isThinking}
        />
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 
                   text-white rounded-full shadow-lg transition-all duration-200 ease-in-out active:scale-95"
        >
          <ChatIcon />
        </button>
      )}
    </div>
  );
} 