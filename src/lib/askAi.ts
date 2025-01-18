import { BoardState, getPieceCharacter, isRed, Position } from "./GameTypes";
import { isValidMove } from "./moveValidation";
import { parseMove } from "./ucci";

// Helper function for delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAIMoveWithRetry(
  chessState: BoardState,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<{
  success: boolean;
  aimove?: [Position, Position];
  message?: string;
  explanation?: string;
  debugInfo?: object;
}> {
  let attempts = 0;
  let result;
  while (attempts < maxRetries) {
    result = await getAIMove(chessState);
    if (result.success) {
      return result;
    }
    attempts++;
    if (attempts < maxRetries) {
      await delay(retryDelay);
      console.log(`Retry attempt ${attempts} for AI move...`);
    }
  }
  return {
    success: false,
    ...result,
    message: `AI移动尝试${maxRetries}次均失败`,
  };
}

export async function getAIMove(chessState: BoardState): Promise<{
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
      if (!from || !to) {
        return {
          ...data,
          success: false,
          message: "AI返回的移动格式无效: " + move,
        };
      }
      const moveResult = isValidMove(chessState, from, to);
      
      if (!moveResult.isValid) {
        return {
          ...data,
          success: false,
          message: "AI返回的移动格式无效: " + move + " " + moveResult.reason,
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
      const pieceStr = `${isRed(piece) ? "红" : "黑"}  ${getPieceCharacter(piece)}`;
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
