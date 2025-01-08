export type PlayerColor = 'red' | 'black';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: string;
  color: PlayerColor;
  position: Position;
}

export interface GameState {
  pieces: Piece[];
  selectedPiece: Piece | null;
  currentTurn: PlayerColor;
} 