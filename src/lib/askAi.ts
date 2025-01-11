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
        const message = `AI建议移动: ${move} | ${from.x},${from.y} -> ${to.x},${to.y}`;
        console.log(message);
        return {
            ...data,
            aimove: [from, to],
            message,
        };
    }
    return {
        ...data,
        message: "AI未能提供有效的移动建议",
    };
}
