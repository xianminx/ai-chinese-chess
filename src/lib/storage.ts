import type { ChessState } from './GameTypes';
import { runInBrowser } from './browserUtils';

const CHESS_STATE_KEY = 'chess_state';

export const saveChessState = (state: ChessState): void => {
  runInBrowser(() => {
    localStorage.setItem(CHESS_STATE_KEY, JSON.stringify(state));
  });
};

export const loadChessState = (): ChessState | null => {
  return runInBrowser(() => {
    const savedState = localStorage.getItem(CHESS_STATE_KEY);
    return savedState ? JSON.parse(savedState) : null;
  }, null);
};

export const clearChessState = (): void => {
  runInBrowser(() => {
    localStorage.removeItem(CHESS_STATE_KEY);
  });
}; 