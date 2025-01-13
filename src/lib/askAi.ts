import { ChessState, Position } from "./GameTypes";
import { isValidMove } from "./moveValidation";
import { parseMove } from "./ucci";

export async function getAIMove(chessState: ChessState): Promise<{
  success: boolean;
  aimove?: [Position, Position];
  message?: string;
  explanation?: string;
  debugInfo?: object;
}> {
  try {
    const response = await fetch("/api/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...chessState }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const { success, move } = data;
    if (success) {
      const [from, to] = parseMove(move) as [Position, Position];
      if (!from || !to || !isValidMove(chessState, from, to)) {
        return {
          ...data,
          success: false,
          message: "AI返回的移动格式无效",
        };
      }

      const piece = chessState.board[from.y][from.x];
      if (!piece) {
        return {
          ...data,
          success: false,
          message: "起始位置没有棋子",
        };
      }
      const pieceStr = `${piece?.color === "red" ? "红" : "黑"}${piece?.type}`;
      const message = `AI建议移动: ${move} | ${pieceStr} ${from.x},${from.y} -> ${to.x},${to.y} `;
      console.log(message);

      return {
        ...data,
        success: true,
        aimove: [from, to],
        message,
      };
    }
    return {
      ...data,
      message: "AI未能提供有效的移动建议",
    };
  } catch (error) {
    return {
      success: false,
      message: "AI服务暂时不可用",
      debugInfo: {
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
