import OpenAI from "openai";
import { ChessState } from "../../../lib/GameTypes";
import { isValidUCIMove, UCIMove } from "@/lib/ucci";

type Difficulty = "beginner" | "intermediate" | "advanced";

export class ChessAI {
    private client: OpenAI;
    private difficulty: Difficulty;

    constructor() {
        this.client = new OpenAI();
        this.difficulty = "intermediate";
    }

    async getMove(board: ChessState): Promise<UCIMove | null> {
        try {
            const boardState = this.getBoardState(board);
            const legalMoves = this.getLegalMoves(board);

            const prompt = this.createPrompt(boardState, legalMoves);
            console.log(prompt);

            const response = await this.client.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: this.getSystemPrompt() },
                    { role: "user", content: prompt },
                ],
                temperature: 0.4,
                max_tokens: 100,
            });

            const aiMove = response.choices[0]?.message?.content?.trim();
            console.log("aiMove:", aiMove);

            // Validate move format
            if (aiMove && isValidUCIMove(aiMove)) {
                return aiMove as UCIMove;
            }
            return null;
        } catch (e) {
            console.error("Error getting AI move:", e);
            return null;
        }
    }

    private getBoardState(chessState: ChessState): string {
        // Convert board state to a string representation
        return JSON.stringify(chessState.board);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private getLegalMoves(board: ChessState): string[] {
        // This should be implemented based on your game rules
        // Return array of legal moves in format like ["e2e4", "d2d4", etc]
        return [];
    }

    private getSystemPrompt(): string {
        const difficultyPrompts = {
            beginner:
                "You are a beginner-level chess engine that occasionally makes minor mistakes.",
            intermediate:
                "You are an intermediate-level chess engine that plays solid, strategic moves.",
            advanced:
                "You are an advanced chess engine that plays strong, tactical moves.",
        };
        return difficultyPrompts[this.difficulty];
    }

    private createPrompt(fen: string, legalMoves: string[]): string {
        return `
        Current position (FEN): ${fen}
        Legal moves: ${legalMoves.join(", ")}

        Analyze the position and select a move from the legal moves list.
        Consider:
        1. Material balance
        2. Piece activity and development
        3. King safety
        4. Control of center
        5. Pawn structure

        Respond only with the chosen move in UCI format (e.g., 'e2e4').
        `;
    }

    setDifficulty(level: Difficulty): void {
        this.difficulty = level;
    }

}
