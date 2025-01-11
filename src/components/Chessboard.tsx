"use client";
import { Position, ChessState, Piece } from "../lib/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useState } from "react";
import { isSamePosition } from "../lib/util";
import { useAudio } from "@/hooks/useAudio.tsx";
import { motion } from "motion/react";

interface ChessboardProps {
    gameState: ChessState;
    onMove: (from: Position, to: Position) => boolean;
    onSelect: (position: Position | null) => void;
    onError: (message: string) => void;
}

export default function Chessboard({
    gameState,
    onMove,
    onSelect,
    onError,
}: ChessboardProps) {
    const [boardSize, setBoardSize] = useState({
        width: 0,
        height: 0,
        pieceSize: 0,
        cellSize: 0,
    });
    const [board, setBoard] = useState(gameState.board);

    useEffect(() => {
        setBoard(gameState.board);
    }, [gameState]);

    const playMoveSound = useAudio("/audio/click.wav");
    const playSelectSound = useAudio("/audio/select.wav");
    const playWarningSound = useAudio("/audio/warning.mp3");

    useEffect(() => {
        const updateBoardSize = () => {
            const vw = Math.min(window.innerWidth, 800);
            const width = Math.min(vw * 0.9, 500);
            const height = width * 1.1;
            const cellSize = width / 10;
            const pieceSize = cellSize * 0.7;
            setBoardSize({ width, height, pieceSize, cellSize });
        };

        updateBoardSize();
        window.addEventListener("resize", updateBoardSize);
        return () => window.removeEventListener("resize", updateBoardSize);
    }, []);

    const handleCellClick = (position: Position) => {
        const { selectedPosition, currentTurn } = gameState;
        const pieceAtPosition = board[position.y][position.x];

        const debugObj = {
            currentTurn,
            selectedPosition,
            pieceAtPosition,
            position,
        };
        console.log("clicked: ", JSON.stringify(debugObj));

        if (selectedPosition) {
            // 如果已经选择了棋子, 则进行移动， 或者重新选择棋子
            if (pieceAtPosition && currentTurn === pieceAtPosition.color) {
                // 如果选择的是自己的棋子, 则重新选择棋子
                playSelectSound();
                onSelect(position);
            } else if (onMove(selectedPosition, position)) {
                // 移动或者吃子
                playMoveSound();
            } else {
                // 既不是有效移动， 也不是重新选择棋子， 为无效移动
                playWarningSound();
                // onSelect(null);
                onError("无效移动!");
            }
        } else if (pieceAtPosition) {
            // 如果未选择棋子, 则选择棋子
            if (currentTurn === pieceAtPosition.color) {
                playSelectSound();
                onSelect(position);
            } else {
                // 如果选择的是对方的棋子, 则提示错误
                playWarningSound();
                onError("不能选择对方的棋子!");
            }
        }
    };

    const getPixelPosition = (position: Position) => {
        return {
            left: (position.x + 1) * boardSize.cellSize,
            top: (position.y + 1) * boardSize.cellSize,
        };
    };

    const renderCell = (piece: Piece | null, position: Position) => {
        const { left, top } = getPixelPosition(position);
        const isSelected = isSamePosition(gameState.selectedPosition, position);
        
        const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
        };

        const cell = (
            <Cell
                key={`${position.x}-${position.y}`}
                piece={piece}
                style={{
                    position: "absolute",
                    width: `${boardSize.pieceSize}px`,
                    height: `${boardSize.pieceSize}px`,
                }}
                isSelected={isSelected}
                onClick={() => handleCellClick(position)}
            />
        );

        const shouldAnimate =
            gameState.lastMove &&
            isSamePosition(gameState.lastMove[1], position);

        const fromPixels = shouldAnimate
            ? getPixelPosition(gameState.lastMove![0])
            : null;

        const AnimatedCell = shouldAnimate ? motion.div : "div";

        return (
            <AnimatedCell
                key={`${shouldAnimate ? "animated" : "static"}-${position.x}-${
                    position.y
                }`}
                initial={
                    shouldAnimate
                        ? { left: fromPixels?.left, top: fromPixels?.top }
                        : undefined
                }
                animate={
                    shouldAnimate
                        ? { left, top, scale: 1, opacity: 1 }
                        : undefined
                }
                transition={
                    shouldAnimate
                        ? { duration: 0.5, ease: "easeInOut" }
                        : undefined
                }
                style={baseStyle}
            >
                {cell}
            </AnimatedCell>
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
                {board.map((row, y) =>
                    row.map((_, x) => renderCell(board[y][x], { x, y }))
                )}
            </div>
        </div>
    );
}
