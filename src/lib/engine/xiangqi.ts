// Core types and interfaces for Xiangqi engine

export enum PieceType {
  General = 'General',   // 将/帅
  Advisor = 'Advisor',   // 士/仕
  Elephant = 'Elephant', // 象/相
  Horse = 'Horse',       // 马/馬
  Chariot = 'Chariot',   // 车/車
  Cannon = 'Cannon',     // 炮/砲
  Soldier = 'Soldier'    // 卒/兵
}

export enum Player {
  Red = 'Red',
  Black = 'Black'
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  player: Player;
  position: Position;
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece?: Piece;
}

export interface BoardState {
  pieces: Map<string, Piece>;
  currentPlayer: Player;
  moveHistory: Move[];
}

// Utility type for move evaluation results
export interface MoveEvaluation {
  move: Move;
  score: number;
}