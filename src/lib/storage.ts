import type { BoardState } from "./engine/types";
import { runInBrowser } from "./browserUtils";

const CHESS_STATE_KEY = "chess_state";

export const saveChessState = (state: BoardState): void => {
  runInBrowser(() => {
    try {
      localStorage.setItem(CHESS_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save chess state:", error);
    }
  });
};

export const loadChessState = (): BoardState | null => {
  return runInBrowser(() => {
    try {
      const savedState = localStorage.getItem(CHESS_STATE_KEY);
      if (savedState) {
        const parsedState = savedState ? JSON.parse(savedState) : null;
        if (parsedState && isSavedStateValid(parsedState)) {
          return parsedState;
        } else {
          console.error("Clear invalid saved state:", parsedState);
          localStorage.removeItem(CHESS_STATE_KEY);
        }
      }
      return null;
    } catch (error) {
      console.error("Failed to load chess state:", error);
      return null;
    }
  }, null);
};

function isSavedStateValid(savedState: object): boolean {
  return savedState && typeof savedState === "object" && "board" in savedState && "moveHistory" in savedState && "currentTurn" in savedState && "gameOver" in savedState;
}

export const clearChessState = (): void => {
  runInBrowser(() => {
    try {
      localStorage.removeItem(CHESS_STATE_KEY);
    } catch (error) {
      console.error("Failed to clear chess state:", error);
    }
  });
};
