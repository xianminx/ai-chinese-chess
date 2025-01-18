'use client'

import { useMemo } from "react";
import { computeWinner } from "../half_math";

interface GridProps {
  rows: number;
  cols: number;
  cellSize: number;
}

export default function Grid({ rows, cols, cellSize }: GridProps) {
  // Precompute results for visible numbers
  const results = useMemo(() => {
    return Array(rows).fill(0).map((_, row) =>
      Array(cols).fill(0).map((_, col) => {
        const number = row * cols + col;
        return computeWinner(number);
      })
    );
  }, [rows, cols]);

  return (
    <div
      className="relative rounded-xl shadow-lg overflow-hidden bg-white select-none"
      style={{
        width: `${cols * cellSize + 1}px`,
        height: `${rows * cellSize}px`,
        minWidth: cellSize + "px",
        minHeight: cellSize + "px"
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`
        }}
      >
        {results.map((row, i) =>
          row.map((isWinning, j) => {
            const number = i * cols + j;
            return (
              <div
                key={`${i}-${j}`}
                className={`
                  relative flex items-center justify-center
                  ${isWinning 
                    ? 'bg-gradient-to-br from-emerald-50 to-sky-50 hover:from-emerald-100 hover:to-sky-100' 
                    : ''
                  }
                  transition-all duration-300 ease-in-out text-[10px]
                `}
              >
                <div className="font-medium text-gray-700">
                  {number}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 