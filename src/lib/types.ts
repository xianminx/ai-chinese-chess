export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

export interface MoveRequest {
  from_square: string;
  to_square: string;
}

export interface GameState {
  board: Record<string, ChessPiece>;
  current_turn: PieceColor;
  game_status: 'active' | 'checkmate' | 'stalemate' | 'draw';
} 