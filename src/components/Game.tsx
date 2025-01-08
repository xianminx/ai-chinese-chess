"use client";

import Chessboard from "./Chessboard";
import { useGameState } from "@/hooks/useGameState";

export default function Game() {
    const { gameState, selectPiece, movePiece, resetGame } = useGameState();

    return (
        <div className="w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-4xl flex flex-col items-center gap-6">
                {/* Game Info Header */}
                <div className="w-full text-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800">中国象棋</h1>
                    <div className="text-lg text-gray-600">
                        当前: {
                            gameState.currentTurn === "red" ? 
                            <span className="text-red-400 font-bold text-lg">红方</span> : 
                            <span className="text-black font-bold text-lg">黑方</span>
                        }
                    </div>
                </div>

                {/* Chessboard Container */}
                <div className="w-full max-w-2xl aspect-square">
                    <Chessboard
                        gameState={gameState}
                        onPieceSelect={selectPiece}
                        onPieceMove={movePiece}
                    />
                </div>

                {/* Controls */}
                <div className="w-full flex items-center justify-center gap-4 mt-2">
                    <button
                        className="rounded-lg bg-[#4682b4] px-6 py-2.5 text-white hover:bg-[#357abd] 
                                 transition-colors shadow-md hover:shadow-lg font-medium"
                        onClick={resetGame}
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </div>
    );
}
