"use client";
import { Piece, Position, GameState } from "../types/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useRef, useState } from "react";
import { isValidMove } from "../utils/moveValidation";

interface ChessboardProps {
    gameState: GameState;
    onPieceSelect: (piece: Piece | null) => void;
    onPieceMove: (from: Position, to: Position) => void;
}

export default function Chessboard({
    gameState,
    onPieceSelect,
    onPieceMove,
}: ChessboardProps) {
    const { pieces, selectedPiece } = gameState;
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
    const [cellSize, setCellSize] = useState(0);
    const clickAudioRef = useRef<HTMLAudioElement | null>(null);
    const selectAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio instances
        clickAudioRef.current = new Audio("/audio/click.wav");
        selectAudioRef.current = new Audio("/audio/select.wav");
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

    const selectPiece = (piece: Piece | null) => {
        playSelectSound();
        onPieceSelect(piece);
    };

    const movePiece = (from: Position, to: Position) => {
        playMoveSound();
        onPieceMove(from, to);
    };

    const handleCellClick = (position: Position) => {
        const pieceAtPosition = pieces.find(
            (p) => p.position.x === position.x && p.position.y === position.y
        );

        if (selectedPiece) {
            if (isValidMove(gameState, selectedPiece.position, position)) {
                movePiece(selectedPiece.position, position);
                selectPiece(null);
            } else if (pieceAtPosition) {
                selectPiece(pieceAtPosition);
            }
        } else if (pieceAtPosition) {
            selectPiece(pieceAtPosition);
        }
    };

    const getPixelPosition = (position: Position) => {
        return {
            left: `${((position.x + 1) / 10) * boardSize.width}px`,
            top: `${((position.y + 1) / 11) * boardSize.height}px`,
        };
    };

    const renderCell = (position: Position) => {
        const piece = pieces.find(
            (p) => p.position.x === position.x && p.position.y === position.y
        );
        const { left, top } = getPixelPosition(position);
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
                isSelected={Boolean(
                    selectedPiece &&
                        selectedPiece.position.x === position.x &&
                        selectedPiece.position.y === position.y
                )}
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
                {Array.from({ length: 9 }, (_, x) =>
                    Array.from({ length: 10 }, (_, y) => renderCell({ x, y }))
                )}
            </div>
        </div>
    );
}
