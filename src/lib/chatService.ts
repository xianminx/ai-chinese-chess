import { BoardState } from "./GameTypes";

interface ChatResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
  error?: string;
}

export async function sendChatMessage(
  message: string,
  gameState: BoardState
): Promise<ChatResponse> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        gameState,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat service error:", error);
    throw error;
  }
} 