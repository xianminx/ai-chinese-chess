import { SearchEngine } from "../engine/search";
import { BoardState } from "../engine/types";
import { getPieceCharacter, isRed } from "../engine/utils";
import { MoveSuggestion, AIEngine } from "./AIEngine";
import { SettingsType } from "@/components/providers/SettingsProvider";

export class MinimaxEngine implements AIEngine {
    async findBestMove(state: BoardState, settings?: SettingsType): Promise<MoveSuggestion> {
        try {
            const searchEngine = new SearchEngine();
            const depth = settings?.minimaxDepth || 3;
            const moveEvaluation = searchEngine.findBestMove(state, depth);
            const { move } = moveEvaluation;
            if (!move) {
                return {
                    success: false,
                    error: "No move found"
                };
            }
            const { from, to, piece } = move;
            const pieceStr = `${isRed(piece!) ? "红" : "黑"}${getPieceCharacter(piece!)}`;
            const message = `Minimax 建议移动: ${pieceStr} ${from.x},${from.y} -> ${to.x},${to.y} `;
            return {
                success: !!move,
                message,
                ...moveEvaluation,
            };
        } catch (error) {
            console.error("MinimaxEngine.findBestMove", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error"
            };
        }
    }
}