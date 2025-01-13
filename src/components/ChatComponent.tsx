"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChessState } from "@/lib/GameTypes";
import { sendChatMessage } from "@/lib/chatService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatComponentProps {
  gameState: ChessState;
  isThinking: boolean;
}

export default function ChatComponent({ gameState, isThinking }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

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
      const response = await sendChatMessage(input, gameState);
      
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Custom renderer for code blocks
  const CodeBlock = ({
    node,
    inline,
    className,
    children,
    ...props
  }: {
    node?: any;
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>) => {
    const language = className?.replace('language-', '') || 'text';
    return (
      <div className="relative group">
        <pre className={`${className} rounded-md bg-gray-800 p-4 overflow-x-auto`}>
          <code className={`language-${language} text-sm text-gray-100`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end space-y-2">
      {/* Chat Window */}
      <div
        className={`${
          isCollapsed ? 'hidden' : 'flex'
        } flex-col w-80 sm:w-[440px] h-[600px] bg-white rounded-lg shadow-xl transition-all duration-200 ease-in-out border border-gray-200`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-700">AI 助手</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-500">
                {isThinking ? '思考中...' : '在线'}
              </span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`px-2 py-2 ${
                message.role === "assistant" ? "bg-white border-b border-gray-100" : "bg-gray-50"
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
                  <div className="font-medium text-sm text-gray-500">
                    {message.role === "user" ? "你" : "AI 助手"}
                  </div>
                  <div className="text-gray-700 text-sm prose prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: CodeBlock,
                        // Style other markdown elements
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ href, children }) => (
                          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-gray-300 pl-4 italic my-2">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2">
                            <table className="min-w-full divide-y divide-gray-200">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t rounded-b-lg">
          <form onSubmit={handleSubmit} className="relative flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="发送消息给 AI 助手..."
              rows={1}
              className="w-full pr-24 py-2 px-3 text-sm text-gray-700 bg-gray-50 rounded-lg 
                 border border-gray-200 focus:outline-none focus:border-gray-300
                 resize-none min-h-[40px] max-h-[120px]"
              disabled={isThinking}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {isThinking ? "思考中..." : "Enter 发送"}
              </span>
              <button
                type="submit"
                disabled={isThinking}
                className="p-1.5 rounded-md bg-gray-700 text-white hover:bg-gray-600
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Independent Chat Toggle Button */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-200 ease-in-out active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
} 