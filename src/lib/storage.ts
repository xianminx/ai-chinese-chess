import type { BoardState } from './engine/types';
import { runInBrowser } from './browserUtils';

const CHESS_STATE_KEY = 'chess_state';

export const saveChessState = (state: BoardState): void => {
  runInBrowser(() => {
    try {
      localStorage.setItem(CHESS_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save chess state:', error);
    }
  });
};

export const loadChessState = (): BoardState | null => {
  return runInBrowser(() => {
    try {
      const savedState = localStorage.getItem(CHESS_STATE_KEY);
      const parsedState = savedState ? JSON.parse(savedState) : null;
      const state = {
        ...parsedState,
        board: parsedState?.board || [],
        moveHistory: parsedState?.moveHistory || [],
        currentTurn: parsedState?.currentTurn || "red",
        gameOver: parsedState?.gameOver || false,
      };
      return state;
    } catch (error) {
      console.error('Failed to load chess state:', error);
      return null;
    }
  }, null);
};

export const clearChessState = (): void => {
  runInBrowser(() => {
    try {
      localStorage.removeItem(CHESS_STATE_KEY);
    } catch (error) {
      console.error('Failed to clear chess state:', error);
    }
  });
}; 