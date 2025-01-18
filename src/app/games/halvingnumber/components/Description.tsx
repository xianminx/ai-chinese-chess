"use client";

import { useState } from "react";

export default function Description() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow transition-all"
      >
        <svg 
          className="w-5 h-5 text-gray-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-gray-600">Game Rules</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="m-4 p-6 bg-white rounded-2xl shadow-xl">
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
                        the first player will win or lose with perfect play. Here${"'"}s how it works:
                      </p>
                      <p className="text-sm leading-relaxed mt-3">
                        For any position N {'>'} 2, you win if either:
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

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

