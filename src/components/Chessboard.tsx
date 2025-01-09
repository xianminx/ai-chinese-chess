"use client";
import { Position, ChessState } from "../lib/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useRef, useState } from "react";

interface ChessboardProps {
    gameState: ChessState;
    onMove: (from: Position, to: Position) => boolean;
    onSelect: (position: Position | null) => void;
    onInvalidTurn: (message: string) => void;
}

export default function Chessboard({
    gameState,
    onMove,
    onSelect,
    onInvalidTurn,
}: ChessboardProps) {
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
    const [cellSize, setCellSize] = useState(0);
    const clickAudioRef = useRef<HTMLAudioElement | null>(null);
    const selectAudioRef = useRef<HTMLAudioElement | null>(null);
    const warningAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio instances
        clickAudioRef.current = new Audio("/audio/click.wav");
        selectAudioRef.current = new Audio("/audio/select.wav");
        warningAudioRef.current = new Audio("/audio/warning.mp3");
    }, []);

    const playMoveSound = () => {
        if (clickAudioRef.current) {
            clickAudioRef.current.currentTime = 0;
            clickAudioRef.current.play();
        }
    };

    const playSelectSound = () => {
        if (selectAudioRef.current) {
            selectAudioRef.current.currentTime = 0;
            selectAudioRef.current.play();
        }
    };

    const playWarningSound = () => {
        if (warningAudioRef.current) {
            warningAudioRef.current.currentTime = 0;
            warningAudioRef.current.play();
        }
    };

    useEffect(() => {
        const updateBoardSize = () => {
            const vw = Math.min(window.innerWidth, 800);
            const width = Math.min(vw * 0.9, 500);
            const height = width * 1.1;
            setCellSize(width / 14);
            setBoardSize({ width, height });
        };

        updateBoardSize();
        window.addEventListener("resize", updateBoardSize);
        return () => window.removeEventListener("resize", updateBoardSize);
    }, []);

    const handleCellClick = (position: Position) => {
        const { selectedPosition, currentTurn } = gameState;
        const pieceAtPosition = gameState.board[position.y][position.x];
        
        if (selectedPosition) {
            if (onMove(selectedPosition, position)) {
                playMoveSound();
            } else if (pieceAtPosition) {
                if(currentTurn === pieceAtPosition.color) {
                    playSelectSound();
                    onSelect(position);
                } else {
                    playWarningSound();
                    onInvalidTurn("Invalid reselect!");
                }
            } else {
                playWarningSound();
                onSelect(null);
                onInvalidTurn("Invalid Move!");
            }
        } else if (pieceAtPosition) {
            if (currentTurn === pieceAtPosition.color) {
                playSelectSound();
                onSelect(position);
            } else {
                playWarningSound();
                onInvalidTurn("Wrong turn!");
            }
        }
    };

    const getPixelPosition = (position: Position) => {
        return {
            left: `${((position.x + 1) / 10) * boardSize.width}px`,
            top: `${((position.y + 1) / 11) * boardSize.height}px`,
        };
    };

    const renderCell = (position: Position) => {
        const piece = gameState.board[position.y][position.x];
        const { left, top } = getPixelPosition(position);
        const isSelected = gameState.selectedPosition?.x === position.x && 
                          gameState.selectedPosition?.y === position.y;

        return (
            <Cell
                key={`${position.x}-${position.y}`}
                piece={piece}
                style={{
                    position: "absolute",
                    left: left,
                    top: top,
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                }}
                isSelected={isSelected}
                onClick={() => handleCellClick(position)}
            />
        );
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div
                className="relative bg-no-repeat bg-contain bg-center"
                style={{
                    backgroundImage: `url(${BoardGrid.src})`,
                    width: `${boardSize.width}px`,
                    height: `${boardSize.height}px`,
                }}
            >
                {gameState.board.map((row, y) =>
                    row.map((_, x) => renderCell({ x, y }))
                )}
            </div>
        </div>
    );
}
