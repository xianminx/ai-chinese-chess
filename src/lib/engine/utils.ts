import { Piece, PieceCharacter, Position } from "./types";
import { BoardState } from "./types";

export function piece2char(piece: Piece): string {
    return piece;
}

export function char2piece(c: string): Piece {
    return c as Piece;
}

export const isSamePosition = (
    pos1: Position | null,
    pos2: Position | null
) => {
    if (!pos1 || !pos2) return false;
    return pos1.x === pos2.x && pos1.y === pos2.y;
};
export function isRed(char: Piece) {
    return char.toUpperCase() === char;
}

export function isBlack(char: Piece) {
    return char.toLowerCase() === char;
}

export function getPieceColor(char: Piece) {
    return isRed(char) ? "red" : "black";
}

export function getPieceCharacter(char: Piece): PieceCharacter {
    switch (char) {
        case "k":
            return "帅";
        case "r":
            return "車";
        case "h":
            return "馬";
        case "e":
            return "象";
        case "a":
            return "士";
        case "c":
            return "砲";
        case "p":
            return "兵";
        case "K":
            return "帅";
        case "R":
            return "車";
        case "H":
            return "馬";
        case "E":
            return "象";
        case "A":
            return "士";
        case "C":
            return "砲";
        case "P":
            return "兵";
    }
}

export function cloneState(state: BoardState): BoardState {
    return {
        ...state,
        board: state.board.map((row) => [...row]),
        moveHistory: [...state.moveHistory],
    };
}