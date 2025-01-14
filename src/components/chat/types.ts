import { ChessState } from "@/lib/GameTypes";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatComponentProps {
  gameState: ChessState;
  isThinking: boolean;
} 