import {
    Move,
    MoveValidationResult,
    PlayerColor,
    type BoardState,
    type Piece,
    type Position,
} from "./types";
import { getPieceColor } from "./utils";
import { isValidMove as validateMove } from "./moveUtils";
import { char2piece, piece2char } from "./utils";

export function initGame(): BoardState {
    return {
        board: initializeBoard(),
        currentTurn: "red",
        gameStatus: "active",
        moveHistory: [],
    };
}

function initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(10)
        .fill(null)
        .map(() => Array(9).fill(null));

    // Initialize the board with pieces
    // Black pieces (top)
    board[0][0] = "r";
    board[0][1] = "h";
    board[0][2] = "e";
    board[0][3] = "a";
    board[0][4] = "k";
    board[0][5] = "a";
    board[0][6] = "e";
    board[0][7] = "h";
    board[0][8] = "r";

    // Black cannons
    board[2][1] = "c";
    board[2][7] = "c";

    // Black pawns
    board[3][0] = "p";
    board[3][2] = "p";
    board[3][4] = "p";
    board[3][6] = "p";
    board[3][8] = "p";

    // Red pawns
    board[6][0] = "P";
    board[6][2] = "P";
    board[6][4] = "P";
    board[6][6] = "P";
    board[6][8] = "P";

    // Red cannons
    board[7][1] = "C";
    board[7][7] = "C";

    // Red pieces (bottom)
    board[9][0] = "R";
    board[9][1] = "H";
    board[9][2] = "E";
    board[9][3] = "A";
    board[9][4] = "K";
    board[9][5] = "A";
    board[9][6] = "E";
    board[9][7] = "H";
    board[9][8] = "R";

    return board;
}

export function makeMove(state: BoardState, move: Move): BoardState {
    const result = isValidMove(state, move);
    if (!result.isValid) {
        throw new Error(result.reason || "Invalid move");
    }

    // Get the piece at the starting position
    const piece = state.board[move.from.y][move.from.x];
    if (!piece) return state;

    // Create new board with the move applied
    const newBoard = state.board.map((row) => [...row]);

    // Store captured piece for move history
    const capturedPiece = newBoard[move.to.y][move.to.x] as Piece | undefined;

    // Make the move
    newBoard[move.to.y][move.to.x] = piece;
    newBoard[move.from.y][move.from.x] = null;

    // Create new state with the move applied
    const newState = {
        ...state,
        board: newBoard,
        currentTurn:
            state.currentTurn === "red" ? "black" : ("red" as PlayerColor),
        moveHistory: [...state.moveHistory, { ...move, piece, capturedPiece }],
    };

    return newState;
}

export function undoMove(state: BoardState): BoardState {
    const lastMove = getLastMove(state);
    if (!lastMove) return state;

    // Create new board
    const newBoard = state.board.map((row) => [...row]);

    // Get the piece at the current position
    const piece = newBoard[lastMove.to.y][lastMove.to.x];
    if (!piece) return state;

    // Move piece back to original position
    newBoard[lastMove.from.y][lastMove.from.x] = piece;

    // Restore captured piece if any
    if (lastMove.capturedPiece) {
        newBoard[lastMove.to.y][lastMove.to.x] = lastMove.capturedPiece;
    } else {
        newBoard[lastMove.to.y][lastMove.to.x] = null;
    }

    // Return new state
    return {
        ...state,
        board: newBoard,
        currentTurn: state.currentTurn === "red" ? "black" : "red",
        moveHistory: state.moveHistory.slice(0, -1),
    };
}

export function reset(): BoardState {
    return initGame();
}

export function getLastMove(state: BoardState): Move | null {
    return state && state.moveHistory && state.moveHistory.length > 0 ? state.moveHistory[state.moveHistory.length - 1] : null;
}

export function toFen(state: BoardState): string {
    const rows: string[] = state.board.map((row) => {
        let rowString = "";
        let emptyCount = 0;

        for (const piece of row) {
            if (piece) {
                if (emptyCount > 0) {
                    rowString += emptyCount.toString();
                    emptyCount = 0;
                }
                rowString += piece2char(piece);
            } else {
                emptyCount++;
            }
        }
        if (emptyCount > 0) {
            rowString += emptyCount.toString();
        }
        return rowString;
    });

    const turn = state.currentTurn === "red" ? "r" : "b";
    return `${rows.join("/")} ${turn} - - 0 1`;
}

export function fromFen(fen: string): BoardState {
    const [boardPart, turn] = fen.split(" ");
    const board: (Piece | null)[][] = Array(10)
        .fill(null)
        .map(() => Array(9).fill(null));

    const rows = boardPart.split("/");
    for (let y = 0; y < rows.length; y++) {
        let x = 0;
        for (const char of rows[y]) {
            if (isNaN(Number(char))) {
                const piece: Piece = char2piece(char);
                board[y][x++] = piece;
            } else {
                x += Number(char);
            }
        }
    }

    return {
        board: board,
        currentTurn: turn === "r" ? "red" : "black",
        gameStatus: "active",
        moveHistory: [],
    };
}


export function isValidMove(
    state: BoardState,
    move: Move
): MoveValidationResult {
    const result = validateMove(state, move.from, move.to);
    return result;
}

export function isKingInCheck(
    state: BoardState,
    kingColor: PlayerColor
): boolean {
    // Find the king's position
    const kingPiece = kingColor === "red" ? "K" : "k";
    let kingPos: Position | null = null;

    for (let y = 0; y < state.board.length; y++) {
        for (let x = 0; x < state.board[y].length; x++) {
            if (state.board[y][x] === kingPiece) {
                kingPos = { x, y };
                break;
            }
        }
        if (kingPos) break;
    }

    if (!kingPos) return false;

    // Check if any opponent piece can capture the king
    for (let y = 0; y < state.board.length; y++) {
        for (let x = 0; x < state.board[y].length; x++) {
            const piece = state.board[y][x];
            if (piece && getPieceColor(piece) !== kingColor) {
                const result = validateMove(state, { x, y }, kingPos);
                if (result.isValid) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function doesMoveCauseCheck(state: BoardState, move: Move): boolean {
    // Create a copy of the board to simulate the move
    const boardCopy = state.board.map((row) => [...row]);

    // Apply the move to the copy
    boardCopy[move.to.y][move.to.x] = boardCopy[move.from.y][move.from.x];
    boardCopy[move.from.y][move.from.x] = null;

    // Create a temporary state with the new board
    const tempState = {
        ...state,
        board: boardCopy,
    };

    // Use cchess's isKingInCheck method
    return isKingInCheck(
        tempState,
        state.currentTurn === "red" ? "black" : "red"
    );
}

export function getLegalMoves(state: BoardState): Move[] {
    return generateLegalMoves(state);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateLegalMoves(state: BoardState): Move[] {
    const legalMoves: Move[] = [];
    // Your move generation logic here
    return legalMoves;
}

const chess = {
    initGame,
    makeMove,
    undoMove,
    reset,
    toFen,
    fromFen,
    isValidMove,
    isKingInCheck,
    doesMoveCauseCheck,
    getLegalMoves,
    getLastMove,
};
export default chess;
