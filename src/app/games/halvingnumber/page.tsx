"use client";

import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import Game from "./components/Game";
import Description from "./components/Description";

const MAX_NUMBERS = 3000;

export default function HalvingNumberGrid() {
  const [showVisualization, setShowVisualization] = useState(false);
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(20);
  const [cellSize, setCellSize] = useState(50);
  const [maxCols, setMaxCols] = useState(50);
  const [maxRows, setMaxRows] = useState(50);

  // Update maxCols and maxRows based on window size and MAX_NUMBERS
  useEffect(() => {
    const updateMaxDimensions = () => {
      const padding = 64;
      const maxWidth = window.innerWidth - padding;
      const newMaxCols = Math.floor((maxWidth - 20) / cellSize);
      setMaxCols(newMaxCols);

      const newMaxRows = Math.floor(MAX_NUMBERS / cols);
      setMaxRows(newMaxRows);

      if (cols > newMaxCols) setCols(newMaxCols);
      if (rows > newMaxRows) setRows(newMaxRows);
    };

    updateMaxDimensions();
    window.addEventListener("resize", updateMaxDimensions);
    return () => window.removeEventListener("resize", updateMaxDimensions);
  }, [cellSize, cols, rows]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto p-4 sm:p-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Halving Number Game
          </h1>
          <p className="text-gray-600 mb-6">
            A mathematical game of strategy
          </p>
          <Description />
        </div>

        {/* Game Section */}
        <Game />

        {/* Visualization Toggle */}
        <div className="text-center mt-12 mb-6">
          <button
            onClick={() => setShowVisualization(!showVisualization)}
            className="px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            {showVisualization ? "Hide" : "Show"} Winning Positions Visualization
          </button>
        </div>

        {/* Visualization Section */}
        {showVisualization && (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-4">
              <div className="w-full sm:w-auto bg-white rounded-lg shadow-sm py-3 px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <label className="whitespace-nowrap text-sm">Total: </label>
                    <span className="font-medium text-sm">{rows * cols}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <label className="whitespace-nowrap text-sm w-14">
                        Rows:
                      </label>
                      <input
                        type="range"
                        min="1"
                        max={maxRows}
                        value={rows}
                        onChange={(e) => setRows(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="w-8 text-center text-sm">{rows}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="whitespace-nowrap text-sm w-14">
                        Cols:
                      </label>
                      <input
                        type="range"
                        min="1"
                        max={maxCols}
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="w-8 text-center text-sm">{cols}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="whitespace-nowrap text-sm w-14">
                        Size:
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="50"
                        value={cellSize}
                        onChange={(e) => setCellSize(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="w-8 text-center text-sm">{cellSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="flex justify-center mb-8 overflow-auto mt-8">
              <Grid rows={rows} cols={cols} cellSize={cellSize} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
