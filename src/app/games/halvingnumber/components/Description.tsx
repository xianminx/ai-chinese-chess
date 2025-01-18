"use client";

import { useState } from "react";

export default function Description() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
        Halving Number Game
      </h1>

      <div className="w-full max-w-2xl mx-auto">
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
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 mt-3 bg-white/30 backdrop-blur-sm rounded-xl">
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
                <h3 className="text-lg font-medium text-gray-800 mb-2">Strategy</h3>
                <div className="space-y-2">
                  <p className="leading-relaxed mb-3">
                    Each position is either winning or losing. Here's how it works:
                  </p>
                  <div className="grid gap-2">
                    {[
                      { n: "1", desc: "Losing - any move gives 0" },
                      { n: "2", desc: "Winning - divide by 2 to reach 1" },
                      { n: ">2", desc: "Win if you can reach a losing position" }
                    ].map(({ n, desc }) => (
                      <div key={n} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                        <span className="font-mono px-3 py-1 bg-white rounded-md shadow-sm">
                          {n}
                        </span>
                        <span>{desc}</span>
                      </div>
                    ))}
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

