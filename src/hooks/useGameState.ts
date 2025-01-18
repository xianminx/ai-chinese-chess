import { useRef, useState, useCallback } from 'react';
import { CChess } from '../lib/CChess';
import { Position, BoardState, Move } from '../lib/GameTypes';

export const useCChessState = () => {
  const gameRef = useRef<CChess>(new CChess());
  const [gameState, setGameState] = useState<BoardState>(gameRef.current.getGameState());

  const handleMove = useCallback((move: Move) => {
    if (gameRef.current.isValidMove(move)) {
      console.log("valid move", gameState.currentTurn, move.from, move.to);
      gameRef.current.makeMove(move);
      setGameState(gameRef.current.getGameState());
      return true;
    }
    console.log("invalid move", move.from, move.to);
    return false;
  }, [gameState]);

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