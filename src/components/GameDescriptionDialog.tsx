interface GameDescriptionProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GameDescription({ isOpen, onClose }: GameDescriptionProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full mx-4 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">中国象棋AI智能体说明</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="text-gray-600 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className={`max-w-2xl px-4`}>
                        <p className="text-gray-600 mb-6 text-left">
                            使用基于OpenAI大模型的 <span className="text-blue-600">中国象棋 Agent</span> 驱动， 体验传统中国象棋与现代人工智能技术的结合。与智能对手对弈，对手基于 GPT-4 等模型，可根据您的走棋动态调整策略，带来极富挑战的游戏体验。AI 引擎会分析多个战略因素，包括子力均势、棋子活动度、将军安全、中心控制、兵型结构等，从而做出最优决策。
                        </p>
                        <div className="mt-4 mb-6">
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                <li>支持多种难度级别：初级、中级和高级</li>
                                <li>实时分析局面，动态调整策略</li>
                                <li>考虑全局战略与具体战术</li>
                                <li>模拟人类对弈思维过程</li>
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600 mb-8">
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                实时走棋
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                智能对手
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                移动友好
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <p>
                            <a
                                href="https://www.xiangqi.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                查看详细规则 →
                            </a>
                        </p>
                        <p className="text-sm text-gray-500">
                            Powered by{' '}
                            <a
                                href="https://openai.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                OpenAI GPT-4
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
