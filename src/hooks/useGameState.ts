import { useRef, useState, useCallback } from 'react';
import { CChess } from '../lib/CChess';
import { Position, ChessState } from '../lib/GameTypes';

export const useCChessState = () => {
  const gameRef = useRef<CChess>(new CChess());
  const [gameState, setGameState] = useState<ChessState>(gameRef.current.getGameState());

  const handleMove = useCallback((from: Position, to: Position) => {
    if (gameRef.current.isValidMove(from, to)) {
      gameRef.current.movePiece(from, to);
      setGameState(gameRef.current.getGameState());
      return true;
    }
    return false;
  }, []);

  const handlePieceSelect = useCallback((position: Position | null) => {
    gameRef.current.selectPiece(position);
    setGameState(gameRef.current.getGameState());
  }, []);

  const handleReset = useCallback(() => {
    gameRef.current.reset();
    setGameState(gameRef.current.getGameState());
  }, []);

  return {
    gameState,
    onMove: handleMove,
    onSelect: handlePieceSelect,
    onReset: handleReset,
  };
}; 