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
          MINIMAX: "Minimax with Alpha-Beta Pruning"
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
        aiModel: "Modelo de IA"
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
        aiModel: "AI 模型"
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
  }
  // Add more languages as needed
};

export type Language = keyof typeof translations; 