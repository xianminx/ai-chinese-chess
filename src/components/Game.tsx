"use client";

import Chessboard from "./Chessboard";
import { useGameState } from "@/hooks/useGameState";

export default function Game() {
    const { gameState, selectPiece, movePiece, resetGame } = useGameState();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl flex flex-col items-center gap-4">
                <div className="w-full aspect-square">
                    <Chessboard
                        gameState={gameState}
                        onPieceSelect={selectPiece}
                        onPieceMove={movePiece}
                    />
                </div>
                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <button
                        className="rounded bg-[#4682b4] px-4 py-2 text-white hover:bg-[#357abd] transition-colors"
                        onClick={resetGame}
                    >
                        Reset Game
                    </button>
                    <div className="text-lg font-medium">
                        Current Turn: {gameState.currentTurn}
                    </div>
                </div>
            </div>
        </div>
    );
}
