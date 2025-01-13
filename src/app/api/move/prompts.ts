import { DIFFICULTY_PROMPTS as DIFFICULTY_PROMPTS_2, SYSTEM_PROMPT as SYSTEM_PROMPT_2, getUserPrompt as getUserPrompt_2 } from "./prompts_2";
import { DIFFICULTY_PROMPTS as DIFFICULTY_PROMPTS_1, SYSTEM_PROMPT as SYSTEM_PROMPT_1, getUserPrompt as  getUserPrompt_1 } from "./prompts_1";

// eslint-disable-next-line prefer-const
let PROMPT_VERSION = 2;

export const SYSTEM_PROMPT = PROMPT_VERSION === 1 ? SYSTEM_PROMPT_1 : SYSTEM_PROMPT_2;
export const getUserPrompt = PROMPT_VERSION === 1 ? getUserPrompt_1 : getUserPrompt_2;
export const DIFFICULTY_PROMPTS = PROMPT_VERSION === 1 ? DIFFICULTY_PROMPTS_1 : DIFFICULTY_PROMPTS_2;
export type DifficultyLevel = keyof typeof DIFFICULTY_PROMPTS;
