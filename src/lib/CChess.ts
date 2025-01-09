import type { ChessState, Piece, Position } from './GameTypes';
import { isValidMove } from '@/utils/moveValidation';

export const INITIAL_BOARD: (Piece | null)[][] = Array(10).fill(null).map(() => Array(9).fill(null));

// Initialize the board with pieces
// Black pieces (top)
INITIAL_BOARD[0][0] = { type: '車', color: 'black' };
INITIAL_BOARD[0][1] = { type: '馬', color: 'black' };
INITIAL_BOARD[0][2] = { type: '象', color: 'black' };
INITIAL_BOARD[0][3] = { type: '士', color: 'black' };
INITIAL_BOARD[0][4] = { type: '将', color: 'black' };
INITIAL_BOARD[0][5] = { type: '士', color: 'black' };
INITIAL_BOARD[0][6] = { type: '象', color: 'black' };
INITIAL_BOARD[0][7] = { type: '馬', color: 'black' };
INITIAL_BOARD[0][8] = { type: '車', color: 'black' };

// Black cannons
INITIAL_BOARD[2][1] = { type: '炮', color: 'black' };
INITIAL_BOARD[2][7] = { type: '炮', color: 'black' };

// Black pawns
INITIAL_BOARD[3][0] = { type: '卒', color: 'black' };
INITIAL_BOARD[3][2] = { type: '卒', color: 'black' };
INITIAL_BOARD[3][4] = { type: '卒', color: 'black' };
INITIAL_BOARD[3][6] = { type: '卒', color: 'black' };
INITIAL_BOARD[3][8] = { type: '卒', color: 'black' };

// Red pawns
INITIAL_BOARD[6][0] = { type: '兵', color: 'red' };
INITIAL_BOARD[6][2] = { type: '兵', color: 'red' };
INITIAL_BOARD[6][4] = { type: '兵', color: 'red' };
INITIAL_BOARD[6][6] = { type: '兵', color: 'red' };
INITIAL_BOARD[6][8] = { type: '兵', color: 'red' };

// Red cannons
INITIAL_BOARD[7][1] = { type: '炮', color: 'red' };
INITIAL_BOARD[7][7] = { type: '炮', color: 'red' };

// Red pieces (bottom)
INITIAL_BOARD[9][0] = { type: '俥', color: 'red' };
INITIAL_BOARD[9][1] = { type: '马', color: 'red' };
INITIAL_BOARD[9][2] = { type: '相', color: 'red' };
INITIAL_BOARD[9][3] = { type: '仕', color: 'red' };
INITIAL_BOARD[9][4] = { type: '帅', color: 'red' };
INITIAL_BOARD[9][5] = { type: '仕', color: 'red' };
INITIAL_BOARD[9][6] = { type: '相', color: 'red' };
INITIAL_BOARD[9][7] = { type: '马', color: 'red' };
INITIAL_BOARD[9][8] = { type: '俥', color: 'red' };

export const INITIAL_GAME_STATE: ChessState = {
  board: INITIAL_BOARD,
  selectedPosition: null,
  currentTurn: 'red',
  gameStatus: 'active'
};

export class CChess {
  private gameState: ChessState;
  
  constructor() {
    this.gameState = this.initGame();
  }

  private initGame(): ChessState {
    return {
      ...INITIAL_GAME_STATE,
      board: INITIAL_BOARD.map(row => [...row])  // Deep copy the initial board
    };
  }

  public getGameState(): ChessState {
    return {
      ...this.gameState,
      board: this.gameState.board.map(row => [...row])  // Return immutable copy
    };
  }

  public selectPiece(position: Position | null): void {
    this.gameState = {
      ...this.gameState,
      selectedPosition: position
    };
  }

  public isValidMove(from: Position, to: Position): boolean {
    return isValidMove(this.gameState, from, to);
  }

  public movePiece(from: Position, to: Position): void {
    const newBoard = this.gameState.board.map(row => [...row]);
    const piece = newBoard[from.y][from.x];
    
    newBoard[to.y][to.x] = piece;
    newBoard[from.y][from.x] = null;
    
    this.gameState = {
      ...this.gameState,
      board: newBoard,
      selectedPosition: null,
      currentTurn: this.gameState.currentTurn === 'red' ? 'black' : 'red'
    };
  }

  public reset(): void {
    this.gameState = this.initGame();
  }

  // Utility methods
  public toFen(): string {
    return '';  // TODO: Implement FEN string generation
  }

  public static fromFen(fen: string): ChessState {
    return INITIAL_GAME_STATE;  // TODO: Implement FEN parsing
  }
}