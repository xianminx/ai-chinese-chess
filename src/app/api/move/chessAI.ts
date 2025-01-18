import OpenAI from "openai";
import { BoardState } from "@/lib/GameTypes";
import { isValidUCIMove, UCIMove } from "@/lib/ucci";
import { CChess } from "@/lib/CChess";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { DIFFICULTY_PROMPTS, getUserPrompt, SYSTEM_PROMPT } from "./prompts";

type Difficulty = "beginner" | "intermediate" | "advanced";
const MODEL = "gpt-4o"; // gpt-4o-mini

export class ChessAI {
  private client: OpenAI;
  private difficulty: Difficulty;

  constructor() {
    this.client = new OpenAI();
    this.difficulty = "advanced";
  }

  async getMove(board: BoardState): Promise<{
    success: boolean;
    move?: UCIMove;
    error?: string;
    debugInfo?: object;
  }> {
    const fen = CChess.toFen(board);
    const model = MODEL;
    const isO1 = model.toLowerCase().includes("o1");
    // o1 series models are not using system prompt, and do not support temperature and max_tokens
    const messages: ChatCompletionMessageParam[] = isO1
      ? [
          {
            role: "user",
            content: `${this.getSystemPrompt()} \n ${getUserPrompt(fen)}`,
          },
        ]
      : [
          { role: "system", content: this.getSystemPrompt() },
          { role: "user", content: getUserPrompt(fen) },
        ];

    const request = {
      model: MODEL,
      messages,
      ...(isO1 ? {} : { temperature: 0.4, max_tokens: 1000 }),
    };

    try {
      const response = await this.client.chat.completions.create(request);

      const msg = response.choices[0]?.message?.content?.trim() || "";

      try {
        const moveData = JSON.parse(msg);
        const { move } = moveData;

        // Validate move format
        if (move && isValidUCIMove(move)) {
          return {
            ...moveData,
            success: true,
            debugInfo: { request, response },
          };
        }
      } catch (e) {
        console.error("Error parsing move:", e);
        return {
          error: "Invalid move format",
          success: false,
          debugInfo: { request, response },
        };
      }

      return {
        error: "Invalid move format",
        success: false,
        debugInfo: { request, response },
      };
    } catch (e) {
      console.error("Error getting AI move:", e);
      return {
        error: e instanceof Error ? e.message : "Unknown error",
        success: false,
        debugInfo: { error: e, request },
      };
    }
  }

  private getSystemPrompt(): string {
    return `${DIFFICULTY_PROMPTS[this.difficulty]} \n ${SYSTEM_PROMPT}`;
  }

  setDifficulty(level: Difficulty): void {
    this.difficulty = level;
  }
}
