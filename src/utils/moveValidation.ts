import { GameState, Position, ChessPiece, PieceType } from '../types/GameTypes';

const isWithinBoard = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 10;
};

const isSamePosition = (pos1: Position, pos2: Position): boolean => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

const isValidGeneralMove = (piece: ChessPiece, from: Position, to: Position): boolean => {
  // General can only move within palace (3x3 grid)
  const isInPalace = (pos: Position, color: 'red' | 'black'): boolean => {
    const y = color === 'red' ? [7, 8, 9] : [0, 1, 2];
    return pos.x >= 3 && pos.x <= 5 && y.includes(pos.y);
  };

  if (!isInPalace(to, piece.color)) return false;

  // General can only move one step horizontally or vertically
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

const isValidAdvisorMove = (piece: ChessPiece, from: Position, to: Position): boolean => {
  // Advisor can only move diagonally within palace
  const isInPalace = (pos: Position, color: 'red' | 'black'): boolean => {
    const y = color === 'red' ? [7, 8, 9] : [0, 1, 2];
    return pos.x >= 3 && pos.x <= 5 && y.includes(pos.y);
  };

  if (!isInPalace(to, piece.color)) return false;

  // Advisor moves one step diagonally
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  return dx === 1 && dy === 1;
};

export const isValidMove = (
  gameState: GameState,
  from: Position,
  to: Position
): boolean => {
  const piece = gameState.pieces.find(p => 
    p.position.x === from.x && p.position.y === from.y
  );

  if (!piece || piece.color !== gameState.currentTurn) return false;
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
      return isValidGeneralMove(piece, from, to);
    case '士':
      return isValidAdvisorMove(piece, from, to);
    // TODO: Implement other piece movement rules
    default:
      return true; // Temporary allow all moves for other pieces
  }
}; 