export type PlayerColor = "red" | "black";
export type GameStatus =
    | "active"
    | "check"
    | "checkmate"
    | "stalemate"
    | "draw";

// https://www.chessprogramming.org/Chinese_Chess#Programming
// K: King, 将/帅
// R: Rook, 車/车
// H: Horse, 馬/马
// E: Elephant, 象/相
// A: Advisor, 士/仕
// C: Cannon, 炮/砲
// P: Pawn, 卒/兵
export type PieceCharacter =
    | "帅"
    | "将"
    | "車"
    | "车"
    | "馬"
    | "马"
    | "象"
    | "相"
    | "士"
    | "仕"
    | "卒"
    | "兵"
    | "炮"
    | "砲";

export type Piece =
    | "K"
    | "R"
    | "H"
    | "E"
    | "A"
    | "C"
    | "P"
    | "k"
    | "r"
    | "h"
    | "e"
    | "a"
    | "c"
    | "p";

export interface Position {
    x: number;
    y: number;
}

export type MoveValidationResult = {
    isValid: boolean;
    reason?: string;
};

export type ShowType = "Character" | "Icon";

export interface Move {
    piece?: Piece;
    from: Position;
    to: Position;
    capturedPiece?: Piece;
}

// Utility type for move evaluation results
export interface MoveEvaluation {
    move?: Move;
    score: number;
}

export interface BoardState {
    // 9x10 board for Chinese Chess, null represents empty cell
    board: (Piece | null)[][];
    currentTurn: PlayerColor;
    gameStatus: GameStatus;
    moveHistory: Move[];
}
