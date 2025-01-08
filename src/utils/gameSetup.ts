import { GameState, ChessPiece, PieceType, PlayerColor } from '../types/GameTypes';

const createPiece = (
  type: PieceType,
  color: PlayerColor,
  x: number,
  y: number,
  index: number
): ChessPiece => ({
  type,
  color,
  position: { x, y },
  id: `${color}-${type}-${index}`,
});

const createInitialPieces = (): ChessPiece[] => {
  const pieces: ChessPiece[] = [];
  let index = 0;

  // Add red pieces
  pieces.push(
    createPiece('車', 'red', 0, 9, index++),
    createPiece('马', 'red', 1, 9, index++),
    createPiece('相', 'red', 2, 9, index++),
    createPiece('士', 'red', 3, 9, index++),
    createPiece('帥', 'red', 4, 9, index++),
    createPiece('士', 'red', 5, 9, index++),
    createPiece('相', 'red', 6, 9, index++),
    createPiece('马', 'red', 7, 9, index++),
    createPiece('車', 'red', 8, 9, index++),
    createPiece('炮', 'red', 1, 7, index++),
    createPiece('炮', 'red', 7, 7, index++)
  );

  // Add red pawns
  for (let i = 0; i < 5; i++) {
    pieces.push(createPiece('兵', 'red', i * 2, 6, index++));
  }

  // Add black pieces
  pieces.push(
    createPiece('車', 'black', 0, 0, index++),
    createPiece('马', 'black', 1, 0, index++),
    createPiece('象', 'black', 2, 0, index++),
    createPiece('士', 'black', 3, 0, index++),
    createPiece('将', 'black', 4, 0, index++),
    createPiece('士', 'black', 5, 0, index++),
    createPiece('象', 'black', 6, 0, index++),
    createPiece('马', 'black', 7, 0, index++),
    createPiece('車', 'black', 8, 0, index++),
    createPiece('炮', 'black', 1, 2, index++),
    createPiece('炮', 'black', 7, 2, index++)
  );

  // Add black pawns
  for (let i = 0; i < 5; i++) {
    pieces.push(createPiece('卒', 'black', i * 2, 3, index++));
  }

  return pieces;
};

export const initialGameState: GameState = {
  pieces: createInitialPieces(),
  currentTurn: 'red',
  selectedPiece: null,
  gameStatus: 'ongoing',
}; 