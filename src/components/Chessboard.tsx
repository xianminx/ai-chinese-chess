"use client";
import { Piece, Position, GameState } from "../types/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        const updateBoardSize = () => {
            const vw = Math.min(window.innerWidth, 800);
            const width = Math.min(vw * 0.9, 500);
            const height = width * 1.1;
            setBoardSize({ width, height });
        };

        updateBoardSize();
        window.addEventListener('resize', updateBoardSize);
        return () => window.removeEventListener('resize', updateBoardSize);
    }, []);

    const handleCellClick = (position: Position) => {
        const pieceAtPosition = pieces.find(
            (p) => p.position.x === position.x && p.position.y === position.y
        );

        if (selectedPiece) {
            if (isValidMove(selectedPiece.position, position)) {
                onPieceMove(selectedPiece.position, position);
                onPieceSelect(null);
            } else if (pieceAtPosition) {
                onPieceSelect(pieceAtPosition);
            }
        } else if (pieceAtPosition) {
            onPieceSelect(pieceAtPosition);
        }
    };

    const isValidMove = (from: Position, to: Position): boolean => {
        if (to.x < 0 || to.x > 8 || to.y < 0 || to.y > 9) return false;

        const destinationPiece = pieces.find(
            (p) => p.position.x === to.x && p.position.y === to.y
        );
        if (destinationPiece && destinationPiece.color === selectedPiece?.color)
            return false;

        return true;
    };

    const getPixelPosition = (position: Position) => {
        return {
            left: `${((position.x + 1) / 10) * boardSize.width}px`,
            top: `${((position.y + 1) / 11) * boardSize.height}px`,
        };
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
                {pieces.map((piece) => {
                    const { left, top } = getPixelPosition(piece.position);
                    const cellSize = boardSize.width / 14;          
                    return (
                        <Cell
                            key={`${piece.type}-${piece.color}-${piece.position.x}-${piece.position.y}`}
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
                                    selectedPiece.position.x === piece.position.x &&
                                    selectedPiece.position.y === piece.position.y
                            )}
                            onClick={() => handleCellClick(piece.position)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
