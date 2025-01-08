import type { GameState, ChessPiece, PieceColor } from './types';

export class GameController {
  private board: Record<string, ChessPiece>;
  private currentTurn: PieceColor;
  private gameStatus: GameState['game_status'];

  constructor() {
    // Initialize your game state here
    this.board = this.initializeBoard();
    this.currentTurn = 'white';
    this.gameStatus = 'active';
  }

  private initializeBoard(): Record<string, ChessPiece> {
    // Initialize an empty board - implement actual chess setup
    return {};
  }

  make_move(fromSquare: string, toSquare: string): boolean {
    // Implement your move logic here
    const piece = this.board[fromSquare];
    if (piece && piece.color === this.currentTurn) {
      this.board[toSquare] = piece;
      delete this.board[fromSquare];
      this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
      return true;
    }
    return false;
  }

  get_current_turn(): PieceColor {
    return this.currentTurn;
  }

  get_game_status(): GameState['game_status'] {
    return this.gameStatus;
  }

  get_board(): Record<string, ChessPiece> {
    return this.board;
  }
}

// Create a singleton instance
export const gameInstance = new GameController(); 