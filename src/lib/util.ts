import { Piece, Position } from "./GameTypes";

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
