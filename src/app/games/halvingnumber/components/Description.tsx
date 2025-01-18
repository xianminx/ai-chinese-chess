"use client";

import { useState } from "react";

export default function Description() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-center relative max-w-5xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Halving Number Game
      </h1>

      <div className="w-full  mx-auto">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group w-full px-6 py-4 flex flex-col items-center gap-3 text-left rounded-xl transition-colors hover:bg-white/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-sky-50 rounded-lg flex justify-center items-center shadow-sm">
              <span className="text-lg font-medium text-gray-600">W</span>
            </div>
            <span className="text-lg text-gray-600">= Winning Position</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Learn game rules and theory</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isExpanded ? "rotate-180" : ""
              } group-hover:translate-y-1`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        <div
          className={`absolute left-0 right-0 z-10 overflow-hidden transition-all duration-300 ease-in-out${
            isExpanded ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 mt-3 bg-white/95 border border-gray-200 backdrop-blur-sm rounded-xl shadow-lg">
            <div className="space-y-6 text-gray-600">
              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-2">How to Play</h3>
                <p className="leading-relaxed">
                  Starting with a number, players take turns making moves. 
                  The player forced to reach 0 loses the game.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Your Moves</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-mono text-center text-gray-800">÷2</div>
                    <div className="mt-1 text-sm text-center text-gray-500">
                      Divide by two
                      <span className="block text-xs mt-1 text-gray-400">
                        (rounded down)
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-mono text-center text-gray-800">-1</div>
                    <div className="mt-1 text-sm text-center text-gray-500">
                      Subtract one
                      <span className="block text-xs mt-1 text-gray-400">
                        (when possible)
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Mathematical Pattern</h3>
                <div className="space-y-2">
                  <div className="p-4 bg-white/50 rounded-lg text-left">
                    <p className="text-sm leading-relaxed">
                      This game is deterministic - for any starting number, we can predict whether 
                      the first player will win or lose with perfect play. Here's how it works:
                    </p>
                    <p className="text-sm leading-relaxed mt-3">
                      For any position N > 2, you win if either:
                    </p>
                    <ul className="list-disc ml-4 mt-2 text-sm space-y-2">
                      <li>
                        Dividing by 2 (⌊N/2⌋) leads to a losing position for your opponent
                      </li>
                      <li>
                        Subtracting 1 (N-1) leads to a losing position for your opponent
                      </li>
                    </ul>
                    <p className="text-sm mt-3 text-gray-600">
                      This creates a predictable pattern of winning and losing positions 
                      that you can learn to recognize.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

