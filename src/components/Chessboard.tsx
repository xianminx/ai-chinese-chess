"use client";
import { Position, ChessState, getPieceColor, Piece } from "../lib/GameTypes";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useState } from "react";
import { isSamePosition } from "../lib/util";
import { useAudio } from "@/hooks/useAudio.tsx";
import { motion } from "motion/react";
import { isValidMove } from "../lib/moveValidation";
import toast from "react-hot-toast";
import { useSettings } from "./providers/SettingsProvider";

interface ChessboardProps {
  gameState: ChessState;
  onMove: (from: Position, to: Position) => boolean;
  onSelect: (position: Position | null) => void;
  onError: (message: string) => void;
  showCoordinates?: boolean;
}

const X_AXIS_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const Y_AXIS_LABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Chessboard({
  gameState,
  onMove,
  onSelect,
  onError,
  showCoordinates = true,
}: ChessboardProps) {
  const [boardSize, setBoardSize] = useState({
    width: 0,
    height: 0,
    pieceSize: 0,
    cellSize: 0,
  });
  const [board, setBoard] = useState(gameState.board);

  //   const playEndSound = useAudio("/audio/end.mp3");
  const [checkBgColor, setCheckBgColor] = useState("#F4D6A0");
  const { settings } = useSettings();
  const showType = settings.useIcons ? "Icon" : "Character";

  useEffect(() => {
    if (gameState.gameStatus === "check") {
      toast.error(
        `${gameState.currentTurn === "red" ? "红方" : "黑方"}被将军！`,
        {
          icon: "⚠️",
        }
      );

      setCheckBgColor(
        gameState.currentTurn === "red"
          ? "rgba(255, 0, 0, 0.3)"
          : "rgba(0, 0, 0, 0.3)"
      );
    } else {
      setCheckBgColor("#F4D6A0");
    }
  }, [gameState]);

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
      // 如果已经选择了棋子，则进行移动或者重新选择棋子
      if (pieceAtPosition && currentTurn === getPieceColor(pieceAtPosition)) {
        // 如果选择的是自己的棋子，则重新选择棋子
        playSelectSound();
        onSelect(position);
      } else {
        // 验证移动是否合法
        const moveResult = isValidMove(gameState, selectedPosition, position);
        if (moveResult.isValid) {
          // 移动或者吃子
          onMove(selectedPosition, position);
          playMoveSound();
        } else {
          // 无效移动
          playWarningSound();
          onError(moveResult.reason || "无效移动!");
        }
      }
    } else if (pieceAtPosition) {
      // 如果未选择棋子，则选择棋子
      if (currentTurn === getPieceColor(pieceAtPosition)) {
        playSelectSound();
        onSelect(position);
      } else {
        // 如果选择的是对方的棋子，则提示错误
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
        showType={showType}
      />
    );

    const shouldAnimate =
      gameState.lastMove && isSamePosition(gameState.lastMove[1], position);

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
          shouldAnimate ? { left, top, scale: 1, opacity: 1 } : undefined
        }
        transition={
          shouldAnimate ? { duration: 0.5, ease: "easeInOut" } : undefined
        }
        style={baseStyle}
      >
        {cell}
      </AnimatedCell>
    );
  };

  return (
    <div className="relative">
      <div
        className={`relative bg-no-repeat bg-contain bg-center transition-colors duration-300`}
        style={{
          backgroundImage: `url(${BoardGrid.src})`,
          width: `${boardSize.width}px`,
          height: `${boardSize.height}px`,
          backgroundColor: `${checkBgColor}`,
        }}
      >
        {showCoordinates && (
          <>
            {/* Y-axis labels (numbers) */}
            <div
              className="absolute left-0 top-0 bottom-0 flex flex-col justify-between"
              style={{
                height: `${boardSize.height}px`,
                paddingTop: `${boardSize.cellSize - 5}px`,
                paddingBottom: `${boardSize.cellSize - 5}px`,
                paddingLeft: `${boardSize.cellSize * 0.3}px`,
              }}
            >
              {Y_AXIS_LABELS.map((label) => (
                <span key={label} className="text-sm text-gray-600 leading-none">
                  {label}
                </span>
              ))}
            </div>

            {/* X-axis labels */}
            <div
              className="absolute left-0 bottom-0 w-full flex justify-between"
              style={{
                paddingLeft: `${boardSize.cellSize-5}px`,
                paddingRight: `${boardSize.cellSize-5}px`,
                paddingBottom: `${boardSize.cellSize * 0.3}px`,
              }}
            >
              {X_AXIS_LABELS.map((label) => (
                <span key={label} className="text-sm text-gray-600">
                  {label}
                </span>
              ))}
            </div>
          </>
        )}

        {board.map((row, y) =>
          row.map((_, x) => renderCell(board[y][x], { x, y }))
        )}
      </div>
    </div>
  );
}
