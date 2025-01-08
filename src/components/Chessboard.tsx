"use client";
import { Piece, Position, GameState } from "../types/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useRef, useState } from "react";

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
    const audioRef = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        audioRef.current = new Audio("/audio/click.wav");
    }, []);

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


    const playMoveSounce = () => {   
        if (audioRef.current) {
       audioRef.current.currentTime = 0;
       audioRef.current.src = "/audio/move.wav";
       audioRef.current.play();
   }
   }

   const playSelectSounce = () => {
       if (audioRef.current) {
           audioRef.current.currentTime = 0;
           audioRef.current.src = "/audio/select.wav";
           audioRef.current.play();
       }
   }
   
    const selectPiece = (piece: Piece | null) => {
        playSelectSounce();
        onPieceSelect(piece);
    };


    const movePiece = (from: Position, to: Position) => {
        playMoveSounce();
        onPieceMove(from, to);
    };

    const handleCellClick = (position: Position) => {
        const pieceAtPosition = pieces.find(
            (p) => p.position.x === position.x && p.position.y === position.y
        );

        if (selectedPiece) {
            if (isValidMove(selectedPiece.position, position)) {
                movePiece(selectedPiece.position, position);
                selectPiece(null);
            } else if (pieceAtPosition) {
                selectPiece(pieceAtPosition);
            }
        } else if (pieceAtPosition) {
            selectPiece(pieceAtPosition);
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
                {Array.from({ length: 10 }, (_, x) =>
                    Array.from({ length: 11 }, (_, y) => renderCell({ x, y }))
                )}
            </div>
        </div>
    );
}
