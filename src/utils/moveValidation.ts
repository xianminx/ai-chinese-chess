import { GameState, Position, Piece } from '../types/GameTypes';

const isWithinBoard = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 10;
};

const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

// Helper function to check if a position is within a player's palace
const isInPalace = (pos: Position, color: 'red' | 'black'): boolean => {
  const y = color === 'red' ? [7, 8, 9] : [0, 1, 2];
  return pos.x >= 3 && pos.x <= 5 && y.includes(pos.y);
};

// General move validation: Can only move within palace (3x3 grid)
const isValidGeneralMove = (piece: Piece, from: Position, to: Position): boolean => {
  if (!isInPalace(to, piece.color)) return false;
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

// Advisor move validation: Can only move diagonally within the palace
const isValidAdvisorMove = (piece: Piece, from: Position, to: Position): boolean => {
  if (!isInPalace(to, piece.color)) return false;
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return dx === 1 && dy === 1;
};

// Chariot move validation: Can move horizontally or vertically any number of squares
const isValidChariotMove = (gameState: GameState, piece: Piece, from: Position, to: Position): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dx !== 0 && dy !== 0) return false; // Chariot moves in a straight line

  const stepX = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
  const stepY = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

  let x = from.x + stepX;
  let y = from.y + stepY;
  while (x !== to.x || y !== to.y) {
    if (gameState.pieces.some(p => p.position.x === x && p.position.y === y)) {
      return false; // Blocked by another piece
    }
    x += stepX;
    y += stepY;
  }

  return true;
};

// Horse move validation: Moves like an "L" shape
const isValidHorseMove = (piece: Piece, from: Position, to: Position): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
};

// Soldier move validation: Can move forward one step, or sideways after crossing the river
const isValidSoldierMove = (piece: Piece, from: Position, to: Position): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (piece.color === 'red' && from.y < 5) {
    return dx === 0 && dy === 1; // Only move forward in the red half
  } else if (piece.color === 'black' && from.y > 4) {
    return dx === 0 && dy === 1; // Only move forward in the black half
  } else {
    return (dx === 0 && dy === 1) || (dx === 1 && dy === 0); // Move forward or sideways after crossing the river
  }
};

// Cannon move validation: Moves like a chariot, but must jump over at least one piece
const isValidCannonMove = (gameState: GameState, piece: Piece, from: Position, to: Position): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  
  if (dx !== 0 && dy !== 0) return false; // The Cannon must move in a straight line (either horizontally or vertically)

  // Determine direction of movement
  const stepX = to.x > from.x ? 1 : to.x < from.x ? -1 : 0;
  const stepY = to.y > from.y ? 1 : to.y < from.y ? -1 : 0;

  let x = from.x + stepX;
  let y = from.y + stepY;
  let foundPiece = false;  // Flag to track if we encounter a piece in the way

  // Traverse from the starting position to the target position
  while (x !== to.x || y !== to.y) {
    const pieceAtPosition = gameState.pieces.find(p => p.position.x === x && p.position.y === y);

    if (pieceAtPosition) {
      if (foundPiece) {
        // The Cannon can only jump over exactly one piece, no more
        return false;
      }
      foundPiece = true;  // Found the first piece to jump over
    }
    
    // Move one step closer to the target position
    x += stepX;
    y += stepY;
  }

  // If the target position has no piece or the piece is of the opposite color, the move is valid
  const targetPiece = gameState.pieces.find(p => p.position.x === to.x && p.position.y === to.y);

  if (targetPiece) {
    if (targetPiece.color === piece.color) {
      return false; // Can't capture your own piece
    }
  }

  return foundPiece;  // The move is valid only if a piece was found in the middle of the move
};


// Check if a move puts the general in check
const isGeneralInCheck = (gameState: GameState, generalPosition: Position, color: 'red' | 'black'): boolean => {
  // Iterate through all enemy pieces and check if any can reach the general
  for (const piece of gameState.pieces) {
    if (piece.color !== color) {
      if (isValidMove(gameState, piece.position, generalPosition)) {
        return true; // The general is in check
      }
    }
  }
  return false; // The general is not in check
};

// Main move validation function
export const isValidMove = (
  gameState: GameState,
  from: Position,
  to: Position
): boolean => {
  const piece = gameState.pieces.find(p => 
    p.position.x === from.x && p.position.y === from.y
  );

  if (!piece || piece.color !== gameState.currentTurn) return false; // Piece not found or not the current player's turn
  if (!isWithinBoard(to)) return false;
  if (isSamePosition(from, to)) return false;

  // Check if target position has a friendly piece
  const targetPiece = gameState.pieces.find(p =>
    p.position.x === to.x && p.position.y === to.y
  );
  if (targetPiece && targetPiece.color === piece.color) return false;

  // Validate moves based on piece type
  switch (piece.type) {
    case '将':
    case '帥':
      // General can't move into check
      if (isGeneralInCheck(gameState, to, piece.color)) return false;
      return isValidGeneralMove(piece, from, to);
    case '士':
      return isValidAdvisorMove(piece, from, to);
    case '车':
    case '車':
      return isValidChariotMove(gameState, piece, from, to);
    case '马':
    case '馬':
      return isValidHorseMove(piece, from, to);
    case '兵':
    case '卒':
      return isValidSoldierMove(piece, from, to);
    case '炮':
    case '砲':
      return isValidCannonMove(gameState, piece, from, to);
    default:
      return false; // Invalid piece type
  }
};
