import OpenAI from "openai";
import { ChessState } from "../../../lib/GameTypes";
import { isValidUCIMove, UCIMove } from "@/lib/ucci";
import { CChess } from "@/lib/CChess";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

type Difficulty = "beginner" | "intermediate" | "advanced";

export class ChessAI {
    private client: OpenAI;
    private difficulty: Difficulty;

    constructor() {
        this.client = new OpenAI();
        this.difficulty = "intermediate";
    }

    async getMove(
        board: ChessState
    ): Promise<{
        success: boolean;
        move?: UCIMove;
        error?: string;
        debugInfo?: object;
    }> {
        try {
            const fen = CChess.toFen(board);
            const prompt = this.createPrompt(fen);
            const messages: ChatCompletionMessageParam[] = [
                { role: "system", content: this.getSystemPrompt() },
                { role: "user", content: prompt },
            ];

            const response = await this.client.chat.completions.create({
                model: "gpt-4o-mini",
                messages,
                temperature: 0.4,
                max_tokens: 100,
            });

            const msg = response.choices[0]?.message?.content?.trim() || "{}";

            try {
                const { move } = JSON.parse(msg);

                // Validate move format
                if (move && isValidUCIMove(move)) {
                    return {
                        move: move as UCIMove,
                        success: true,
                        debugInfo: { request: messages, response },
                    };
                }
            } catch (e) {
                console.error("Error parsing move:", e);
                return {
                    error: "Invalid move format",
                    success: false,
                    debugInfo: { request: messages, response },
                };
            }

            return {
                error: "Invalid move format",
                success: false,
                debugInfo: { request: messages, response },
            };
        } catch (e) {
            console.error("Error getting AI move:", e);
            return {
                error: e instanceof Error ? e.message : "Unknown error",
                success: false,
                debugInfo: { error: e },
            };
        }
    }

    private getSystemPrompt(): string {
        const difficultyPrompts: Record<Difficulty, string> = {
            beginner:
                "You are a beginner-level Chinese Chess (中国象棋) engine, playing with simple strategies and occasionally making minor mistakes.",
            intermediate:
                "You are an intermediate-level Chinese Chess (中国象棋) engine, capable of making solid strategic moves and understanding basic tactics.",
            advanced:
                "You are an advanced Chinese Chess (中国象棋) engine, focusing on deep tactical analysis, superior strategy, and maximizing opportunities for material gain.",
        };
        return difficultyPrompts[this.difficulty];
    }

    private createPrompt(fen: string): string {
        return `
            Current position (FEN): ${fen}

            You are an AI tasked with selecting the best move for this position in Chinese Chess (中国象棋).
            Please analyze the position with a focus on the following factors:

            - **Material Balance**: Assess the difference in material (pieces) between both players.
            - **Piece Activity**: Consider the mobility and position of pieces, especially high-value ones like the General and Chariot.
            - **King Safety**: Evaluate the safety of both Generals, looking for threats or open attacks.
            - **Control of the Center**: Prioritize controlling key central positions, especially for pawns, Chariots, and Cannons.
            - **Pawn Structure**: Look at the pawn formation, particularly whether pawns are advanced or blocked and how they can promote or obstruct the opponent’s pieces.
            - **Tactical Opportunities**: Spot threats of captures, forks, pins, and other tactical motifs that could lead to a favorable position.

            Respond **only** in JSON format, like the following example:
            {
                "move": "e2e4"
            }
            Do not include any other information, just the JSON response.
        `;
    }

    setDifficulty(level: Difficulty): void {
        this.difficulty = level;
    }
}
