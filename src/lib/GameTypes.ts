export type PlayerColor = 'red' | 'black';
export type GameStatus = 'active' | 'check' | 'checkmate' | 'stalemate' | 'draw';
// https://www.chessprogramming.org/Chinese_Chess#Programming
// K: King, 将/帅
// R: Rook, 車/车
// H: Horse, 馬/马
// E: Elephant, 象/相
// A: Advisor, 士/仕
// C: Cannon, 炮/砲
// P: Pawn, 卒/兵
export type PieceType = '帅' | '将' |'車' | '车' | '馬' | '马' | '象' | '相' | '士' | '仕' | '卒' | '兵' | '炮' | '砲' ;
export type PieceChar = 'K' | 'R' | 'H' | 'E' | 'A' | 'C' | 'P' | 'k' | 'r' | 'h' | 'e' | 'a' | 'c' | 'p';
export interface Position {
  x: number;
  y: number;
}

export function isRed(char: PieceChar) {
  return char.toUpperCase() === char;
}

export function getPieceCharacter(char: PieceChar): PieceType {
  switch(char) {
    case 'k':
      return '帅';
    case 'r':
      return '車';
    case 'h':
      return '馬';
    case 'e':
      return '象';
    case 'a':
      return '士';
    case 'c':
      return '砲';
    case 'p':
      return '兵';
    case 'K':
      return '帅';
    case 'R':
      return '車';
    case 'H':
      return '馬';
    case 'E':
      return '象';
    case 'A':
      return '士';
    case 'C':
      return '砲';
    case 'P':
      return '兵';
  }
}

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  char: PieceChar;
}

export interface ChessState {
  // 9x10 board for Chinese Chess, null represents empty cell
  board: (Piece | null)[][];
  selectedPosition: Position | null;
  currentTurn: PlayerColor;
  gameStatus: GameStatus;
  lastMove: [Position, Position] | null;
}

export type MoveValidationResult = {
  isValid: boolean;
  reason?: string;
};