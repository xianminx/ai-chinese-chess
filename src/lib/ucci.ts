import { Position } from "./engine/types";

// Define the file type for Chinese Chess (Xiangqi)
type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i";

// Define the rank type for Chinese Chess (Xiangqi)
type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

// Define the UCI move type for Chinese Chess
export type UCIMove = `${File}${Rank}${File}${Rank}`;

// Function to validate UCIMove format for Chinese Chess
export function isValidUCIMove(move: string): move is UCIMove {
    return /^[a-i](10|[1-9])[a-i](10|[1-9])$/.test(move);
}

export function parseMove(move: string): [Position, Position] | null {
    // Use regex to parse the move string
    const regex = /^([a-i])([1-9]|10)([a-i])([1-9]|10)$/;
    const match = move.match(regex);

    if (!match) {
        return null; // Invalid move format
    }

    const [, fromFile, fromRank, toFile, toRank] = match;

    // Convert files ('a' to 'i') to 0-8
    const fileToNumber = (file: string): number =>
        file.charCodeAt(0) - "a".charCodeAt(0);

    // Convert ranks ('1' to '10') to 0-9
    const rankToNumber = (rank: string): number => parseInt(rank) - 1; // Convert rank to zero-based index

    // Create Position objects for both from and to
    const from: Position = {
        x: fileToNumber(fromFile),
        y: rankToNumber(fromRank),
    };

    const to: Position = {
        x: fileToNumber(toFile),
        y: rankToNumber(toRank),
    };

    return [from, to];
}
