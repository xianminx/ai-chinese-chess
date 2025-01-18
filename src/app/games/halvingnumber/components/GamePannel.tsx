"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from 'canvas-confetti';
import { Turn, Action, GameState } from "./PolicyEngine";
import { askForAction } from "./PolicyEngine";


interface ButtonProps {
  disabled: boolean;
  onClick: () => void;
  color: "indigo" | "purple";
  children: React.ReactNode;
}

const ActionButton = ({
  disabled,
  onClick,
  color,
  children,
}: ButtonProps) => {
  const colorVariants = {
    indigo: {
      base: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      hover: "hover:from-indigo-600 hover:to-indigo-700",
      shadow: "shadow-lg shadow-indigo-500/20",
      disabled: "disabled:from-gray-300 disabled:to-gray-400 disabled:opacity-50",
      text: "text-white disabled:text-gray-600",
    },
    purple: {
      base: "bg-gradient-to-r from-purple-500 to-purple-600",
      hover: "hover:from-purple-600 hover:to-purple-700",
      shadow: "shadow-lg shadow-purple-500/20",
      disabled: "disabled:from-gray-300 disabled:to-gray-400 disabled:opacity-50",
      text: "text-white disabled:text-gray-600",
    },
  }[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative 
        px-4 py-5 
        ${colorVariants.base}
        ${colorVariants.hover}
        ${colorVariants.disabled}
        ${colorVariants.shadow}
        rounded-xl 
        transition-all duration-200 
        overflow-hidden
        disabled:cursor-not-allowed
        disabled:transform
        disabled:hover:shadow-none
      `}
    >
      <div className={`
        relative z-10 
        text-2xl font-bold
        ${colorVariants.text}
        drop-shadow-md
        transition-all duration-200
        group-disabled:opacity-50
      `}>
        {children}
      </div>
      <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </button>
  );
};

const HistoryItem = ({
  move,
  index,
  isLatest,
  isAIMove,
}: {
  move: GameState["history"][0];
  index: number;
  isLatest: boolean;
  isAIMove: boolean;
}) => (
  <div
    className={`p-3 rounded-lg border transition-all ${
      isLatest
        ? "bg-indigo-50 border-indigo-200 shadow-sm"
        : isAIMove
        ? "bg-purple-50 border-purple-100"
        : "bg-indigo-50/50 border-indigo-100"
    }`}
  >
    <div className="flex items-center justify-between">
      <div
        className={`text-lg font-medium ${
          isLatest
            ? "text-indigo-600"
            : isAIMove
            ? "text-purple-600"
            : "text-indigo-600"
        }`}
      >
        {move.value}
      </div>
      {move.action && (
        <div
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            isAIMove
              ? "bg-purple-100 text-purple-600"
              : "bg-indigo-100 text-indigo-600"
          }`}
        >
          {move.action === "/" ? "/2" : "-1"}
        </div>
      )}
    </div>
    <div className="flex justify-end">
      <div
        className={`text-xs mt-1 mr-1 ${
          isAIMove ? "text-purple-400" : "text-indigo-400"
        }`}
      >
        {index === 0 ? "Initial Value" : isAIMove ? "AI" : "You"}
      </div>
    </div>
  </div>
);

const DefeatAnimation = ({ onTryAgain }: { onTryAgain: () => void }) => (
  <div className="absolute top-[64px] inset-x-0 bottom-0 pointer-events-none bg-purple-900/30 backdrop-blur-[2px] z-10 flex items-center justify-center animate-fadeIn">
    <div className="flex flex-col items-center gap-6">
      <div className="text-5xl font-bold text-purple-600 animate-glitch drop-shadow-lg">
        Game Over
      </div>
      <div className="text-3xl font-semibold text-purple-500 animate-shake">
        AI Wins!
      </div>
      <button 
        onClick={onTryAgain}
        className="
          pointer-events-auto 
          px-6 py-2
          text-xl font-medium
          bg-purple-500
          hover:bg-purple-500
          text-purple-200
          hover:text-purple-100
          rounded-xl
          border border-purple-400/30
          hover:border-purple-400/50
          animate-pulse 
          transition-all
          duration-200
          shadow-lg
          hover:shadow-purple-500/20
          backdrop-blur-sm
          hover:scale-105
          active:scale-95
        "
      >
        Try Again?
      </button>
    </div>
  </div>
);

const GameStatus = ({ gameState }: { gameState: GameState }) => {
  useEffect(() => {
    if (gameState.gameOver && gameState.turn === "human") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#7c3aed', '#6366f1']
      });
    }
  }, [gameState.gameOver, gameState.turn]);

  return (
    <div className="text-sm font-medium">
      {gameState.gameOver ? (
        <span className={`font-bold animate-pulse ${
          gameState.turn === "ai" ? "text-purple-600" : "text-indigo-600"
        }`}>
          {gameState.turn === "ai" ? "AI Wins!" : "You Win!"}
        </span>
      ) : (
        <span
          className={
            gameState.turn === "human" ? "text-indigo-600" : "text-purple-600"
          }
        >
          {gameState.turn === "human" ? "Your Turn" : "AI Thinking..."}
        </span>
      )}
    </div>
  );
};

// Add this new component for consistent styling
const NumberInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="
      w-20 px-3 py-1.5 
      bg-white 
      border border-indigo-200 
      rounded-lg text-sm 
      text-indigo-900
      placeholder-indigo-300
      focus:outline-none
      focus:border-indigo-400 
      focus:ring-2 
      focus:ring-indigo-100
      transition-all duration-200
      shadow-sm
    "
    min="1"
    max="1000"
    placeholder="30"
  />
);

export default function GamePannel() {
  const [gameState, setGameState] = useState<GameState>({
    value: 30,
    turn: "human",
    history: [{ value: 30 }],
    gameOver: false,
  });
  const [startValue, setStartValue] = useState("30");

  const updateGameState = useCallback(
    (updates: Partial<GameState>) => {
      setGameState((prev) => {

        const newState = {
          ...prev,
          ...updates,
        };
        return newState;
      });
    },
    []
  );

  const makeMove = useCallback(
    (action: Action) => {
      if (gameState.gameOver) return;

      const newValue =
        action === "/" ? Math.floor(gameState.value / 2) : gameState.value - 1;
      
      updateGameState({
        value: newValue,
        history: [...gameState.history, { value: newValue, action }],
        gameOver: newValue === 0,
        turn: "ai",
      });
    },
    [gameState, updateGameState]
  );

  useEffect(() => {
    if (gameState.turn === "ai" && !gameState.gameOver) {
      const aiMoveTimeout = setTimeout(() => {
        const action: Action = askForAction(gameState, "minimax");
        const newValue =
          action === "/" ? Math.floor(gameState.value / 2) : gameState.value - 1;

        updateGameState({
          value: newValue,
          history: [...gameState.history, { value: newValue, action }],
          gameOver: newValue === 0,
          turn: "human",
        });
      }, 1500);

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [gameState, updateGameState]);

  const startNewGame = () => {
    const initialValue = parseInt(startValue) || 30;
    const state = {
        value: initialValue,
        turn: "human" as Turn,
        history: [{ value: initialValue }],
      gameOver: false,
    };
    setGameState(state);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center gap-6">
        {/* Move History */}
        <div className="w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 overflow-hidden shrink-0">
          <div className="p-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 border-b border-indigo-100">
            <h3 className="font-medium text-indigo-900">Move History</h3>
          </div>
          <div className="h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <div className="p-3 space-y-2">
              {gameState.history.map((move, index) => (
                <HistoryItem
                  key={index}
                  move={move}
                  index={index}
                  isLatest={index === gameState.history.length - 1}
                  isAIMove={index > 0 && (index - 1) % 2 === 1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative w-[500px] bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-indigo-100">
          {/* Show defeat animation when AI wins */}
          {gameState.gameOver && gameState.turn === "ai" && (
            <DefeatAnimation onTryAgain={startNewGame} />
          )}
          
          {/* Game Status Bar */}
          <div className="bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 px-6 py-4 flex justify-between items-center border-b border-indigo-100">
            <div className="flex items-center gap-3">
              <NumberInput
                value={startValue}
                onChange={setStartValue}
              />
              <button
                onClick={startNewGame}
                className="
                  px-4 py-1.5 
                  bg-white 
                  hover:bg-indigo-50 
                  text-indigo-600 
                  rounded-lg 
                  text-sm 
                  font-medium 
                  transition-all 
                  shadow-sm 
                  hover:shadow 
                  border 
                  border-indigo-200
                  hover:border-indigo-300
                "
              >
                New Game
              </button>
            </div>
            <GameStatus gameState={gameState} />
          </div>

          {/* Current Value Display */}
          <div className="px-6 py-16 flex flex-col items-center justify-center bg-gradient-to-b from-transparent via-indigo-50/30 to-indigo-100/30">
            <div 
              className={`
                text-8xl font-bold bg-clip-text text-transparent 
                bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
                ${gameState.gameOver ? (
                  gameState.turn === 'ai' ? 'animate-shake' : 'animate-bounce'
                ) : ''}
              `}
            >
              {gameState.value}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 p-6 bg-gradient-to-b from-transparent to-indigo-50/30">
            <ActionButton
              disabled={gameState.turn === "ai" || gameState.gameOver}
              onClick={() => makeMove("/")}
              color="indigo"
            >
              /2
            </ActionButton>
            <ActionButton
              disabled={gameState.turn === "ai" || gameState.gameOver}
              onClick={() => makeMove("-")}
              color="purple"
            >
              -1
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}
