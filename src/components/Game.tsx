"use client";
import Chessboard from "./Chessboard";
import { useCChessState } from "../hooks/useGameState";
import { Toaster, toast } from 'react-hot-toast';
import { useRef, useEffect } from 'react';

export default function Game() {
    const { gameState, onMove, onSelect, onReset } = useCChessState();
    const startAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize start audio
        startAudioRef.current = new Audio("/audio/start.mp3");
    }, []);

    const playStartSound = () => {
        if (startAudioRef.current) {
            startAudioRef.current.currentTime = 0;
            startAudioRef.current.play();
        }
    };

    const handleReset = () => {
        onReset();
        playStartSound();
    };

    return (
        <div className="w-full flex items-center justify-center">
            <Toaster position="top-center" />
            <div className="w-full max-w-4xl flex flex-col items-center gap-6">
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

                <div className="w-full max-w-2xl aspect-square">
                    <Chessboard
                        gameState={gameState}
                        onMove={onMove}
                        onSelect={onSelect}
                        onInvalidTurn={(message) => toast.error(message)}
                    />
                </div>

                <div className="w-full flex items-center justify-center gap-4 mt-2">
                    <button
                        className="rounded-lg bg-[#4682b4] px-6 py-2.5 text-white hover:bg-[#357abd] 
                                 transition-colors shadow-md hover:shadow-lg font-medium"
                        onClick={handleReset}
                    >
                        Reset Game
                    </button>
                </div>
            </div>
        </div>
    );
}
