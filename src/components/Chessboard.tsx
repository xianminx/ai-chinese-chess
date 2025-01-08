"use client";
import { Piece, Position, GameState } from "../types/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";

interface ChessboardProps {
    gameState: GameState;
    onPieceSelect: (piece: Piece | null) => void;
    onPieceMove: (from: Position, to: Position) => void;
}

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 550;

export default function Chessboard({
    gameState,
    onPieceSelect,
    onPieceMove,
}: ChessboardProps) {
    const { pieces, selectedPiece } = gameState;

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
            left: `${((position.x + 1) / 10) * BOARD_WIDTH}px`,
            top: `${((position.y + 1) / 11) * BOARD_HEIGHT}px`,
        };
    };

    return (
        <div
            className={`max-w-[800px] mx-auto absolute inset-0  bg-no-repeat bg-contain bg-center w-[${BOARD_WIDTH}px] h-[${BOARD_HEIGHT}px]`}
            style={{
                backgroundImage: `url(${BoardGrid.src})`,
            }}
        >
            {pieces.map((piece) => {
                const { left, top } = getPixelPosition(piece.position);
                return (
                    <Cell
                        key={`${piece.type}-${piece.color}-${piece.position.x}-${piece.position.y}`}
                        piece={piece}
                        style={{
                            position: "absolute",
                            left: left,
                            top: top,
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
    );
}
