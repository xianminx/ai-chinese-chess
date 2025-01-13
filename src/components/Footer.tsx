"use client";
import { useState } from "react";
import GameDescription from './GameDescriptionDialog';
import Image from "next/image";

export default function Footer() {
    const [showRules, setShowRules] = useState(false);

    return (
        <footer className="w-full py-6 px-4 mt-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-4 text-sm text-gray-500">
                    {/* Child 1: Rules Button */}
                    <div className="text-center flex items-center gap-1">
                        <img
                            src="/icons/document.svg"
                            alt="Rules"
                            width={16}
                            height={16}
                        />
                        <button
                            onClick={() => setShowRules(true)}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                        >
                            <span className="text-blue-600">中国象棋 Agent</span> 说明
                        </button>
                    </div>

                    {/* Child 2: GitHub Link */}
                    <div className="flex items-center gap-1">
                        <Image
                            src="/icons/github.svg"
                            alt="GitHub"
                            width={16}
                            height={16}
                        />
                        <a
                            href="https://github.com/xianminx/ai-chinese-chess"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                        >
                            GitHub
                        </a>
                    </div>
                </div>

                {/* Copyright Row */}
                <div className="text-center text-sm text-gray-500">
                    © 2025 中国象棋 Agent · Built by{" "}
                    <a
                        href="https://github.com/xianminx/ai-chinese-chess"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                    >
                        xianminx
                    </a>
                </div>
            </div>

            {/* Rules Dialog */}
            <GameDescription 
                isOpen={showRules} 
                onClose={() => setShowRules(false)} 
            />
        </footer>
    );
} 