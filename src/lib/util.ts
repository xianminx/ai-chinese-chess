import { Piece } from "./GameTypes";

export const LEGAL_PIECES: { [key: string]: Piece } = {
    R: { type: "車", color: "black", char: "R" },
    N: { type: "馬", color: "black", char: "N" },
    B: { type: "象", color: "black", char: "B" },
    A: { type: "仕", color: "black", char: "A" },
    K: { type: "将", color: "black", char: "K" },
    C: { type: "炮", color: "black", char: "C" },
    P: { type: "卒", color: "black", char: "P" },
    r: { type: "车", color: "red", char: "r" },
    n: { type: "马", color: "red", char: "n" },
    b: { type: "相", color: "red", char: "b" },
    a: { type: "士", color: "red", char: "a" },
    k: { type: "帅", color: "red", char: "k" },
    c: { type: "炮", color: "red", char: "c" },
    p: { type: "兵", color: "red", char: "p" },
};

export function piece2char(piece: Piece): string {
    return piece.char;
}

export function char2piece(c: string): Piece {
    return LEGAL_PIECES[c];
}

