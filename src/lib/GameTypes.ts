export type PlayerColor = 'red' | 'black';
export type GameStatus = 'active' | 'checkmate' | 'stalemate' | 'draw';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: string;
  color: PlayerColor;
}

export interface ChessState {
  // 9x10 board for Chinese Chess, null represents empty cell
  board: (Piece | null)[][];
  selectedPosition: Position | null;
  currentTurn: PlayerColor;
  gameStatus: GameStatus;
}