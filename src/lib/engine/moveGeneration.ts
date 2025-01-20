import { BoardState, Move, Piece, Position } from "./types";
import { isOnBoard, isInPalace, isKingInCheck, isValidMove } from "./moveUtils";
import { getPieceColor } from "./utils";

// Add type for directions
type Direction = [number, number];
type HorseDirection = [number, number, number, number];

type MoveGenerator = (
    state: BoardState,
    pos: Position
) => Move[];

// Add constants for commonly used values
const ORTHOGONAL_DIRECTIONS: Direction[] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const DIAGONAL_DIRECTIONS: Direction[] = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const HORSE_DIRECTIONS: HorseDirection[] = [
    [-2, -1, -1, 0], // Up 2 Left 1
    [-2, 1, -1, 0],  // Up 2 Right 1
    [2, -1, 1, 0],   // Down 2 Left 1
    [2, 1, 1, 0],    // Down 2 Right 1
    [-1, -2, 0, -1], // Left 2 Up 1
    [1, -2, 0, -1],  // Left 2 Down 1
    [-1, 2, 0, 1],   // Right 2 Up 1
    [1, 2, 0, 1]     // Right 2 Down 1
];

const ELEPHANT_DIRECTIONS: Direction[] = [[2, 2], [2, -2], [-2, 2], [-2, -2]];


// Piece-specific move generators
const MOVE_GENERATORS: Partial<Record<Piece, MoveGenerator>> = {
    'K': generateKingMoves,
    'A': generateAdvisorMoves,
    'E': generateElephantMoves,
    'H': generateHorseMoves,
    'R': generateChariotMoves,
    'C': generateCannonMoves,
    'P': generatePawnMoves
};

function getMoveGenerator(piece: Piece): MoveGenerator | undefined {
    const p = piece.toUpperCase() as Piece;
    return MOVE_GENERATORS[p];
}


/**
 * Generates all legal moves for the current player in the given board state.
 * @param state The current board state
 * @returns Array of legal moves
 * @throws Error if board state is invalid or king is not found
 */
export function generateLegalMoves(state: BoardState): Move[] {
    if (!state || !state.board) {
        throw new Error("Invalid board state");
    }

    const { board, currentTurn } = state;
    // const kingPos = findKingPosition(state, currentTurn);
    // if (!kingPos) {
    //     throw new Error(`${currentTurn} king not found on board`);
    // }

    // Pre-allocate array with estimated size
    const allMoves: Move[] = [];
    
    // Use for loops instead of flatMap for better performance
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            const piece = board[y][x];
            if (!piece || getPieceColor(piece) !== currentTurn) continue;
            
            const generator = getMoveGenerator(piece);
            if (generator) {
                const moves = generator(state, { x, y });
            
                allMoves.push(...moves);
            }
        }
    }

    allMoves.filter(move => !move).filter(move => isValidMove(state, move.from, move.to));
    // Filter out moves that would leave the king in check
    return allMoves.filter(move => !wouldBeInCheckAfterMove(state, move));
}

function generateKingMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    return directions
        .map(([dy, dx]) => {
            const newY = pos.y + dy;
            const newX = pos.x + dx;
            const newPos = { x: newX, y: newY };
            
            if (isInPalace(newPos, currentTurn) && 
                (!board[newY][newX] || getPieceColor(board[newY][newX]) !== currentTurn)) {
                return {
                    piece: board[pos.y][pos.x],
                    from: pos,
                    to: newPos,
                    capturedPiece: board[newY][newX] || undefined
                } as Move;
            }
            return null;
        })
        .filter((move) => move !== null).filter((move) => isValidMove(state, move.from, move.to));
}

function generateAdvisorMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const directions = DIAGONAL_DIRECTIONS;
    
    return directions
        .map(([dy, dx]) => {
            const newY = pos.y + dy;
            const newX = pos.x + dx;
            const newPos = { x: newX, y: newY };
            
            if (isInPalace(newPos, currentTurn) && 
                (!board[newY][newX] || getPieceColor(board[newY][newX]) !== currentTurn)) {
                return {
                    piece: board[pos.y][pos.x],
                    from: pos,
                    to: newPos,
                    capturedPiece: board[newY][newX] || undefined
                } as Move;
            }
            return null;
        })
        .filter((move): move is Move => move !== null);
}

function generateElephantMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const directions = ELEPHANT_DIRECTIONS;
    
    return directions
        .map(([dy, dx]) => {
            const newY = pos.y + dy;
            const newX = pos.x + dx;
            const newPos = { x: newX, y: newY };
            const midY = pos.y + dy/2;
            const midX = pos.x + dx/2;
            
            if (isOnBoard(newPos) && 
                !board[midY][midX] && // No blocking piece
                ((currentTurn === 'red' && newY >= 5) || (currentTurn === 'black' && newY <= 4)) &&
                (!board[newY][newX] || getPieceColor(board[newY][newX]) !== currentTurn)) {
                return {
                    piece: board[pos.y][pos.x],
                    from: pos,
                    to: newPos,
                    capturedPiece: board[newY][newX] || undefined
                } as Move;
            }
            return null;
        })
        .filter((move) => move !== null);
}

function generateHorseMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const directions =HORSE_DIRECTIONS;
    
    return directions
        .map(([dy, dx, blockY, blockX]) => {
            const newY = pos.y + dy;
            const newX = pos.x + dx;
            const newPos = { x: newX, y: newY };
            const blockPos = { 
                x: pos.x + blockX, 
                y: pos.y + blockY 
            };
            
            if (isOnBoard(newPos) && 
                !board[blockPos.y][blockPos.x] && // No blocking piece (horse leg)
                (!board[newY][newX] || getPieceColor(board[newY][newX]) !== currentTurn)) {
                return {
                    piece: board[pos.y][pos.x],
                    from: pos,
                    to: newPos,
                    capturedPiece: board[newY][newX] || undefined
                } as Move;
            }
            return null;
        })
        .filter((move) => move !== null);
}

function generateChariotMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const moves: Move[] = [];
    
    for (const [dy, dx] of ORTHOGONAL_DIRECTIONS) {
        let newY = pos.y + dy;
        let newX = pos.x + dx;
        
        while (isOnBoard({ x: newX, y: newY })) {
            const targetPiece = board[newY][newX];
            
            if (!targetPiece) {
                // Empty square - valid move
                moves.push({
                    piece: board[pos.y][pos.x],
                    from: pos,
                    to: { x: newX, y: newY },
                    capturedPiece: undefined
                } as Move);
            } else {
                // Found a piece
                if (getPieceColor(targetPiece) !== currentTurn) {
                    // Can capture opponent's piece
                    moves.push({
                        piece: board[pos.y][pos.x],
                        from: pos,
                        to: { x: newX, y: newY },
                        capturedPiece: targetPiece
                    } as Move);
                }
                break; // Stop in this direction after finding any piece
            }
            
            newY += dy;
            newX += dx;
        }
    }
    
    return moves;
}

function generateCannonMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const moves: Move[] = [];
    const directions = ORTHOGONAL_DIRECTIONS;
    
    for (const [dy, dx] of directions) {
        let newY = pos.y + dy;
        let newX = pos.x + dx;
        let foundPlatform = false;
        
        while (isOnBoard({ x: newX, y: newY })) {
            const targetPiece = board[newY][newX];
            
            if (!targetPiece) {
                if (!foundPlatform) {
                    // Normal move without capture
                    moves.push({
                        piece: board[pos.y][pos.x],
                        from: pos,
                        to: { x: newX, y: newY },
                        capturedPiece: undefined
                    } as Move);
                }
            } else {
                if (!foundPlatform) {
                    foundPlatform = true;
                } else {
                    // Can capture after jumping over exactly one piece
                    if (getPieceColor(targetPiece) !== currentTurn) {
                        moves.push({
                            piece: board[pos.y][pos.x],
                            from: pos,
                            to: { x: newX, y: newY },
                            capturedPiece: targetPiece
                        } as Move);
                    }
                    break;
                }
            }
            
            newY += dy;
            newX += dx;
        }
    }
    
    return moves;
}

function generatePawnMoves(state: BoardState, pos: Position): Move[] {
    const { board, currentTurn } = state;
    const moves: Move[] = [];
    
    // Determine forward direction and if pawn has crossed river
    const isRed = currentTurn === 'red';
    const forwardDir = isRed ? -1 : 1;
    const hasCrossedRiver = isRed ? pos.y <= 4 : pos.y >= 5;
    
    // Forward move
    const forwardY = pos.y + forwardDir;
    if (isOnBoard({ x: pos.x, y: forwardY })) {
        const targetPiece = board[forwardY][pos.x];
        if (!targetPiece || getPieceColor(targetPiece) !== currentTurn) {
            moves.push({
                piece: board[pos.y][pos.x],
                from: pos,
                to: { x: pos.x, y: forwardY },
                capturedPiece: targetPiece || undefined
            } as Move);
        }
    }
    
    // Sideways moves after crossing river
    if (hasCrossedRiver) {
        const sidewaysMoves = [
            { x: pos.x - 1, y: pos.y },
            { x: pos.x + 1, y: pos.y }
        ];
        
        for (const newPos of sidewaysMoves) {
            if (isOnBoard(newPos)) {
                const targetPiece = board[newPos.y][newPos.x];
                if (!targetPiece || getPieceColor(targetPiece) !== currentTurn) {
                    moves.push({
                        piece: board[pos.y][pos.x],
                        from: pos,
                        to: newPos,
                        capturedPiece: targetPiece || undefined
                    } as Move);
                }
            }
        }
    }
    
    return moves;
}

export function wouldBeInCheckAfterMove(state: BoardState, move: Move): boolean {
    const movingPiece = state.board[move.from.y][move.from.x];
    if (!movingPiece) return false;
    
    // Create a new state with the move applied
    const tempState: BoardState = {
        ...state,
        board: state.board.map(row => [...row]),
        currentTurn: state.currentTurn
    };
    
    // Apply the move
    tempState.board[move.to.y][move.to.x] = movingPiece;
    tempState.board[move.from.y][move.from.x] = null;
    
    
    return isKingInCheck(tempState, state.currentTurn);
} 
