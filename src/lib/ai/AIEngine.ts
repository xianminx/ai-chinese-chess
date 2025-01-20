import { SettingsType } from "@/components/providers/SettingsProvider";
import { BoardState, Move } from "../engine/types";

/**
 * Represents the result of an AI move calculation
 */
export type MoveSuggestion = {
    success: boolean;
    move?: Move;
    [key: string]: unknown;
}

/**
 * Interface for chess AI engines
 */
export interface AIEngine {
    /**
     * Calculates the best move for the given board state
     * @param state Current board state
     * @returns Promise resolving to move suggestion
     */
    findBestMove(state: BoardState, settings?: SettingsType): Promise<MoveSuggestion>;
}