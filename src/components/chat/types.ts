import { BoardState } from "@/lib/GameTypes";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatComponentProps {
  gameState: BoardState;
  isThinking: boolean;
} 