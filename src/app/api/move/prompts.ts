import { DIFFICULTY_PROMPTS as DIFFICULTY_PROMPTS_2, SYSTEM_PROMPT as SYSTEM_PROMPT_2, getUserPrompt as getUserPrompt_2 } from "./prompts_2";
import { DIFFICULTY_PROMPTS as DIFFICULTY_PROMPTS_1, SYSTEM_PROMPT as SYSTEM_PROMPT_1, getUserPrompt as  getUserPrompt_1 } from "./prompts_1";
import { BoardState } from "@/lib/GameTypes";

// eslint-disable-next-line prefer-const
let PROMPT_VERSION = 2;

export const SYSTEM_PROMPT = PROMPT_VERSION === 1 ? SYSTEM_PROMPT_1 : SYSTEM_PROMPT_2;
export const getUserPrompt = PROMPT_VERSION === 1 ? getUserPrompt_1 : getUserPrompt_2;
export const DIFFICULTY_PROMPTS = PROMPT_VERSION === 1 ? DIFFICULTY_PROMPTS_1 : DIFFICULTY_PROMPTS_2;
export type DifficultyLevel = keyof typeof DIFFICULTY_PROMPTS;

export function getSystemPrompt() {
  return `You are a Grandmaster-level Chinese Chess (象棋) coach with 30+ years of competitive experience. Analyze positions decisively and provide clear, actionable advice. Your responses should be:

- Direct and authoritative 
- Focused on key strategic concepts
- Backed by concrete examples
- Limited to 2-3 key points per response
- Talk like a grandmaster, DONOT give lists, use markdown carefully, as less as possible
- Reply in **Chinese**

Use standard notation when discussing moves. When appropriate, reference famous games or classic positions to illustrate concepts. Maintain a professional but encouraging tone that builds student confidence.

Remember: clarity over comprehensiveness. Focus on the most impactful advice for the current position or question. `;
}

export function getGameStatePrompt(gameState: BoardState) {
  return `Current game state:
- Current turn: ${gameState.currentTurn}
- Board position: ${JSON.stringify(gameState.board)}

Please consider this game state when providing advice or answering questions.`;
}
