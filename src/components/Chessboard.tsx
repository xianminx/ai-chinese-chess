"use client";
import { Position, BoardState, Piece, Move, MoveValidationResult } from "../lib/engine/types";
import { getPieceColor } from "@/lib/engine/utils";
import BoardGrid from "../../public/board.svg";
import Cell from "./Cell";
import { useEffect, useState } from "react";
import { isSamePosition } from "../lib/engine/utils";
import { useAudio } from "@/hooks/useAudio.tsx";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { useSettings } from "./providers/SettingsProvider";

interface ChessboardProps {
  state: BoardState;
  isValidMove: (state: BoardState, move: Move) => MoveValidationResult;
  onMove: (move: Move) => boolean;
  onError: (message: string) => void;
  showCoordinates?: boolean;
}

const X_AXIS_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
const Y_AXIS_LABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Chessboard({
  state,
  isValidMove,
  onMove,
  onError,
  showCoordinates = true,
}: ChessboardProps) {
  const [boardSize, setBoardSize] = useState({
    width: 0,
    height: 0,
    pieceSize: 0,
    cellSize: 0,
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  //   const playEndSound = useAudio("/audio/end.mp3");
  const [checkBgColor, setCheckBgColor] = useState("#F4D6A0");
  const { settings } = useSettings();
  const showType = settings.useIcons ? "Icon" : "Character";

  useEffect(() => {
    if (state.gameStatus === "check") {
      toast.error(
        `${state.currentTurn === "red" ? "红方" : "黑方"}被将军！`,
        {
          icon: "⚠️",
        }
      );

      setCheckBgColor(
        state.currentTurn === "red"
          ? "rgba(255, 0, 0, 0.3)"
          : "rgba(0, 0, 0, 0.3)"
      );
    } else {
      setCheckBgColor("#F4D6A0");
    }
  }, [state]);

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
    const { currentTurn } = state;
    const pieceAtPosition = state.board[position.y][position.x];

    if (selectedPosition) {
      // 如果已经选择了棋子，则进行移动或者重新选择棋子
      if (pieceAtPosition && currentTurn === getPieceColor(pieceAtPosition)) {
        // 如果选择的是自己的棋子，则重新选择棋子
        playSelectSound();
        setSelectedPosition(position);
      } else {
        // 验证移动是否合法
        const piece = state.board[selectedPosition.y][selectedPosition.x] as Piece;
        const capturedPiece = pieceAtPosition as Piece | undefined;
        const move: Move = {from: selectedPosition, to: position, piece, capturedPiece};
        // TODO: update isValidMove to use engine.isValidMove
        const moveResult = isValidMove(state, move);
        if (moveResult.isValid) {
          // 移动或者吃子
          onMove(move);
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
        setSelectedPosition(position);
      } else {
        // 如果选择的是对方的棋子，则提示错误
        playWarningSound();
        onError("不能选择对方的棋子!");
      }
    } else {
      // 如果未选择棋子，无效点击，则提示错误
      playWarningSound();
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
    const isSelected = isSamePosition(selectedPosition, position);

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

    const lastMove = state.moveHistory[state.moveHistory.length - 1];

    const shouldAnimate = lastMove && isSamePosition(lastMove.to, position);

    const fromPixels = shouldAnimate && lastMove.from ? getPixelPosition(lastMove.from) : null;

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

        {state.board.map((row, y) =>
          row.map((_, x) => renderCell(state.board[y][x], { x, y }))
        )}
      </div>
    </div>
  );
}
