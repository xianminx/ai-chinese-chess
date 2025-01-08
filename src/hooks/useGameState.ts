import { useState } from 'react';
import { GameState, Piece, Position } from '../types/GameTypes';

const INITIAL_PIECES: Piece[] = [
  { type: '俥', color: 'red', position: { x: 0, y: 9 } },
  { type: '马', color: 'red', position: { x: 1, y: 9 } },
  { type: '相', color: 'red', position: { x: 2, y: 9 } },
  { type: '仕', color: 'red', position: { x: 3, y: 9 } },
  { type: '帅', color: 'red', position: { x: 4, y: 9 } },
  { type: '仕', color: 'red', position: { x: 5, y: 9 } },
  { type: '相', color: 'red', position: { x: 6, y: 9 } },
  { type: '马', color: 'red', position: { x: 7, y: 9 } },
  { type: '俥', color: 'red', position: { x: 8, y: 9 } },
  { type: '炮', color: 'red', position: { x: 1, y: 7 } },
  { type: '炮', color: 'red', position: { x: 7, y: 7 } },
  { type: '兵', color: 'red', position: { x: 0, y: 6 } },
  { type: '兵', color: 'red', position: { x: 2, y: 6 } },
  { type: '兵', color: 'red', position: { x: 4, y: 6 } },
  { type: '兵', color: 'red', position: { x: 6, y: 6 } },
  { type: '兵', color: 'red', position: { x: 8, y: 6 } },
  { type: '車', color: 'black', position: { x: 0, y: 0 } },
  { type: '馬', color: 'black', position: { x: 1, y: 0 } },
  { type: '象', color: 'black', position: { x: 2, y: 0 } },
  { type: '士', color: 'black', position: { x: 3, y: 0 } },
  { type: '将', color: 'black', position: { x: 4, y: 0 } },
  { type: '士', color: 'black', position: { x: 5, y: 0 } },
  { type: '象', color: 'black', position: { x: 6, y: 0 } },
  { type: '馬', color: 'black', position: { x: 7, y: 0 } },
  { type: '車', color: 'black', position: { x: 8, y: 0 } },
  { type: '炮', color: 'black', position: { x: 1, y: 2 } },
  { type: '炮', color: 'black', position: { x: 7, y: 2 } },
  { type: '卒', color: 'black', position: { x: 0, y: 3 } },
  { type: '卒', color: 'black', position: { x: 2, y: 3 } },
  { type: '卒', color: 'black', position: { x: 4, y: 3 } },
  { type: '卒', color: 'black', position: { x: 6, y: 3 } },
  { type: '卒', color: 'black', position: { x: 8, y: 3 } },
];

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    pieces: INITIAL_PIECES, // Initialize with your chess pieces
    selectedPiece: null,
    currentTurn: 'red'
  });

  const selectPiece = (piece: Piece | null) => {
    setGameState(prev => ({
      ...prev,
      selectedPiece: piece
    }));
  };

  const movePiece = (from: Position, to: Position) => {
    if (!gameState.selectedPiece) return;

    setGameState(prev => ({
      ...prev,
      pieces: prev.pieces.map(piece => 
        piece === prev.selectedPiece
          ? { ...piece, position: to }
          : piece
      ),
      selectedPiece: null,
      currentTurn: prev.currentTurn === 'red' ? 'black' : 'red'
    }));
  };

  const resetGame = () => {
    setGameState({
      pieces: INITIAL_PIECES,
      selectedPiece: null,
      currentTurn: 'red'
    });
  };

  return { gameState, selectPiece, movePiece, resetGame };
} 