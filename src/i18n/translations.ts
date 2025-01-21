export const translations = {
  en: {
    settings: {
      title: "Game Settings",
      aiSettings: {
        title: "AI Settings",
        playWithAI: "Play with AI",
        aiModel: "AI Model",
        aiEngine: "AI Engine",
        aiEngineOptions: {
          LLM: "LLM Agent",
          MINIMAX: "Minimax with Alpha-Beta Pruning",
          LLM_INFO: "Advanced AI that can explain its moves and adapt to different play styles",
          MINIMAX_INFO: "Traditional chess engine that calculates the best moves several steps ahead"
        },
        aiDifficulty: "AI Difficulty",
        difficultyLevels: {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard"
        }
      },
      displaySettings: {
        title: "Display Settings",
        theme: "Theme",
        themeOptions: {
          light: "Light",
          dark: "Dark",
          system: "System"
        },
        pieceStyle: "Piece Style",
        language: "Language",
        languages: {
          en: "English",
          es: "Español",
          zh: "中文"
        }
      },
      close: "Close settings"
    },
    game: {
      title: "Chinese Chess",
      currentTurn: "Current Turn",
      red: "Red",
      black: "Black",
      askAI: "Ask AI",
      thinking: "Thinking...",
      newGame: "New Game",
      confirmNewGame: {
        title: "Confirm New Game?",
        message: "Current game will be cleared. Are you sure you want to start over?",
        cancel: "Cancel",
        confirm: "Confirm"
      }
    }
  },
  es: {
    settings: {
      title: "Ajustes del Juego",
      aiSettings: {
        title: "Ajustes de la IA",
        playWithAI: "Jugar con IA",
        aiModel: "Modelo de IA",
        aiEngine: "Motor de IA",
        aiEngineOptions: {
          LLM: "Agente LLM",
          MINIMAX: "Minimax con Poda Alfa-Beta",
          LLM_INFO: "IA avanzada que puede explicar sus movimientos y adaptarse a diferentes estilos de juego",
          MINIMAX_INFO: "Motor de ajedrez tradicional que calcula los mejores movimientos varios pasos adelante"
        },
        aiDifficulty: "Dificultad de IA",
        difficultyLevels: {
          easy: "Fácil",
          medium: "Medio",
          hard: "Difícil"
        },
        infoHint: "El Agente LLM utiliza IA para analizar el juego. Minimax usa algoritmos tradicionales de juego."
      },
      displaySettings: {
        title: "Ajustes de Pantalla",
        theme: "Tema",
        themeOptions: {
          light: "Claro",
          dark: "Oscuro",
          system: "Sistema"
        },
        pieceStyle: "Estilo de Piezas",
        language: "Idioma",
        languages: {
          en: "English",
          es: "Español",
          zh: "中文"
        }
      },
      close: "Cerrar ajustes"
    },
    game: {
      title: "Ajedrez Chino",
      currentTurn: "Turno Actual",
      red: "Rojo",
      black: "Negro",
      askAI: "Preguntar AI",
      thinking: "Pensando...",
      newGame: "Nueva Partida",
      confirmNewGame: {
        title: "¿Confirmar Nueva Partida?",
        message: "La partida actual se borrará. ¿Estás seguro de que quieres empezar de nuevo?",
        cancel: "Cancelar",
        confirm: "Confirmar"
      }
    }
  },
  zh: {
    settings: {
      title: "游戏设置",
      aiSettings: {
        title: "AI 设置",
        playWithAI: "与 AI 对战",
        aiModel: "AI 模型",
        aiEngine: "AI 引擎",
        aiEngineOptions: {
          LLM: "LLM 代理",
          MINIMAX: "极小化极大算法与 Alpha-Beta 剪枝",
          LLM_INFO: "高级AI，能够解释移动原因并适应不同的对弈风格",
          MINIMAX_INFO: "传统象棋引擎，能提前计算几步最佳着法"
        },
        aiDifficulty: "AI 难度",
        difficultyLevels: {
          easy: "简单",
          medium: "中等",
          hard: "困难"
        },
        infoHint: "LLM 代理使用人工智能分析游戏。极小化极大算法使用传统游戏算法。"
      },
      displaySettings: {
        title: "显示设置",
        theme: "主题",
        themeOptions: {
          light: "明亮",
          dark: "暗黑",
          system: "系统"
        },
        pieceStyle: "棋子样式",
        language: "语言",
        languages: {
          en: "English",
          es: "Español",
          zh: "中文"
        }
      },
      close: "关闭设置"
    },
    game: {
      title: "中国象棋",
      currentTurn: "当前",
      red: "红方",
      black: "黑方",
      askAI: "询问AI",
      thinking: "思考中...",
      newGame: "重新开局",
      confirmNewGame: {
        title: "确认重新开局？",
        message: "当前对局将会被清除，确定要重新开始吗？",
        cancel: "取消",
        confirm: "确认"
      }
    }
  },
  // Add more languages as needed
};

export type Language = keyof typeof translations; 