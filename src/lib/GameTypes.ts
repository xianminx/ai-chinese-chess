export type PlayerColor = 'red' | 'black';
export type GameStatus = 'active' | 'checkmate' | 'stalemate' | 'draw';
export type PieceType = '車' | '车' | '馬' | '马' | '象' | '相' | '士' | '仕' | '卒' | '兵' | '炮' | '砲' | '帅' | '将';
export type PieceChar = 'R' | 'r' | 'N' | 'n' | 'B' | 'b' | 'A' | 'a' | 'P' | 'p' | 'C' | 'c' | 'K' | 'k';
export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  char: string;
}

export interface ChessState {
  // 9x10 board for Chinese Chess, null represents empty cell
  board: (Piece | null)[][];
  selectedPosition: Position | null;
  currentTurn: PlayerColor;
  gameStatus: GameStatus;
  lastMove: [Position, Position] | null;
}