import { ChessState, Position } from "./GameTypes";
import { parseMove } from "./ucci";

export async function getAIMove(
    chessState: ChessState
): Promise<{ success: boolean; aimove?: [Position, Position]; message?: string; debugInfo?: object }> {
    const response = await fetch("/api/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...chessState }),
    });

    const data = await response.json();
    const { success, move } = data;
    if (success) {
        const [from, to] = parseMove(move) as [Position, Position];
        return {
            ...data,
            aimove: [from, to],
            message: `AI建议移动: ${from.x},${from.y} -> ${to.x},${to.y}`,
        };
    }
    return {
        ...data,
        message: "AI未能提供有效的移动建议",
    };
}
