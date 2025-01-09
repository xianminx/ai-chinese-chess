import { ChessState, Position } from "./GameTypes";
import { parseMove, isValidUCIMove } from "./ucci";

export async function getAIMove(
    chessState: ChessState
): Promise<{ move: [Position, Position]; message: string }> {
    const response = await fetch("/api/move", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...chessState }),
    });

    const data = await response.json();
    if (!isValidUCIMove(data.move)) {
        throw new Error("AI未能提供有效的移动建议");
    } else {
        const [from, to] = parseMove(data.move) as [Position, Position];
        return {
            move: [from, to],
            message: `AI建议移动: ${[from, to]}`,
        };
    }
}
