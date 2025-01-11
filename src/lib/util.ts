import { Piece, Position } from "./GameTypes";

export const LEGAL_PIECES: { [key: string]: Piece } = {
    r: { type: "車", color: "black", char: "r" },
    n: { type: "馬", color: "black", char: "n" },
    b: { type: "象", color: "black", char: "b" },
    a: { type: "仕", color: "black", char: "a" },
    k: { type: "将", color: "black", char: "k" },
    c: { type: "炮", color: "black", char: "c" },
    p: { type: "卒", color: "black", char: "p" },
    R: { type: "车", color: "red", char: "R" },
    N: { type: "马", color: "red", char: "N" },
    B: { type: "相", color: "red", char: "B" },
    A: { type: "士", color: "red", char: "A" },
    K: { type: "帅", color: "red", char: "K" },
    C: { type: "炮", color: "red", char: "C" },
    P: { type: "兵", color: "red", char: "P" },
};

export function piece2char(piece: Piece): string {
    return piece.char;
}

export function char2piece(c: string): Piece {
    return LEGAL_PIECES[c];
}

export const isSamePosition = (
    pos1: Position | null,
    pos2: Position | null
) => {
    if (!pos1 || !pos2) return false;
    return pos1.x === pos2.x && pos1.y === pos2.y;
};
