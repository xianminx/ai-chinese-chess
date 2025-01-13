"use client";
import Chessboard from "./Chessboard";
import { useCChessState } from "../hooks/useGameState";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import { getAIMoveWithRetry } from "../lib/askAi";
import { useAudio } from "@/hooks/useAudio.tsx";
import Image from "next/image";

export default function Game() {
  const { gameState, onMove, onSelect, onReset } = useCChessState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const playStartSound = useAudio("/audio/start.mp3");

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    onReset();
    playStartSound();
    setShowConfirm(false);
  };

  const handleAskAI = async () => {
    const aiThinking = (message: string, explanation: string) =>
      toast.custom(
        (t: any) => (
            <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } relative max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="/icons/openai.svg"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{message}</p>
                  <p className="mt-1 text-sm text-gray-500">{explanation}</p>
                </div>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => toast.dismiss(t.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>          
        ),
        { duration: 3000 }
      );

    setIsThinking(true);
    try {
      const { success, aimove, message, explanation, debugInfo } = await getAIMoveWithRetry(gameState);
      console.log("AI返回的数据", JSON.stringify({ success, aimove, message, explanation, debugInfo }));
      if (aimove && success) {
        aiThinking(
          message || "AI思考中...",
          explanation || "AI正在思考最佳走法..."
        );
        const [from, to] = aimove;
        onMove(from, to);
        console.log(debugInfo);
      } else {
        console.log("AI返回的移动格式无效", debugInfo);
        toast.error(message || "AI返回的移动格式无效", {
          duration: 3000,
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "获取AI建议时出错";
      toast.error(errorMessage, {
        duration: 3000,
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center pt-8">
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center p-4 bg-white">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="icon" width={40} height={40} />
            <h1 className="text-2xl font-bold text-gray-800">中国象棋</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="text-lg text-gray-600">
              当前:{" "}
              {gameState.currentTurn === "red" ? (
                <span className="text-red-400 font-bold text-lg">红方</span>
              ) : (
                <span className="text-black font-bold text-lg">黑方</span>
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="w-24 inline-flex items-center justify-center rounded-md text-sm font-medium
                                         ring-offset-white transition-colors focus-visible:outline-none 
                                         focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 
                                         disabled:pointer-events-none disabled:opacity-50
                                         bg-blue-600 text-white hover:bg-blue-700
                                         active:scale-95 h-9 px-4 py-2"
                onClick={handleAskAI}
                disabled={isThinking}
              >
                {isThinking ? "思考中..." : "询问AI"}
              </button>
              <button
                className="w-24 inline-flex items-center justify-center rounded-md text-sm font-medium
                                         ring-offset-white transition-colors focus-visible:outline-none 
                                         focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 
                                         disabled:pointer-events-none disabled:opacity-50
                                         bg-slate-900 text-slate-50 hover:bg-slate-900/90
                                         active:scale-95 h-9 px-4 py-2"
                onClick={handleReset}
              >
                重新开局
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl aspect-square">
          <Chessboard
            gameState={gameState}
            onMove={onMove}
            onSelect={onSelect}
            onError={(message) => toast.error(message, { duration: 3000 })}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              确认重新开局？
            </h3>
            <p className="text-gray-600 mb-6">
              当前对局将会被清除，确定要重新开始吗？
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium
                                             ring-offset-white transition-colors focus-visible:outline-none 
                                             focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
                                             border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900
                                             active:scale-95 h-9 px-4 py-2"
                onClick={() => setShowConfirm(false)}
              >
                取消
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium
                                             ring-offset-white transition-colors focus-visible:outline-none 
                                             focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2
                                             bg-slate-900 text-slate-50 hover:bg-slate-900/90
                                             active:scale-95 h-9 px-4 py-2"
                onClick={confirmReset}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}