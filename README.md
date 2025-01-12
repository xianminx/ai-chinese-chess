# <img src="public/web-app-manifest-512x512.png" width="30" height="30" style="vertical-align: middle;"> AI Chinese Chess (象棋)

An interactive Chinese Chess (Xiangqi) implementation with AI capabilities, built using Next.js. Try it live at [ai-chinese-chess.vercel.app](https://ai-chinese-chess.vercel.app/)

## Overview

This project implements a Chinese Chess game where players can play against an AI opponent. The AI agent leverages OpenAI's GPT models to analyze the game state and make strategic moves, providing an intelligent and adaptive playing experience.

## Features

- 🎮 Full implementation of Chinese Chess rules
- 🤖 AI opponent powered by OpenAI GPT models
- ⚡ Real-time move validation
- 📱 Responsive design for both desktop and mobile
- 🎨 Modern UI with traditional Chinese Chess aesthetics
- 💬 AI opponent powered by OpenAI GPT models
- 🧠 Strategic move generation based on advanced language model analysis
- 🔄 Option to restart game with AI
- 🌐 Accessible through any modern web browser

## Tech Stack

- Next.js 14
- TypeScript
- OpenAI GPT API
- Vercel (Deployment)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/ai-chinese-chess.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the game.


## AI Implementation

The AI opponent in this Chinese Chess game is powered by OpenAI's GPT models, implementing a sophisticated analysis system that considers multiple strategic factors:

### Core Components
- Uses OpenAI's GPT-4 model for move generation and analysis
- Implements UCI (Universal Chinese Chess Interface) move format
- FEN (Forsyth–Edwards Notation) position representation for board state

### Strategic Analysis Factors
The AI evaluates positions based on several key aspects:
- **Material Balance**: Analyzes the difference in piece count and value between players
- **Piece Activity**: Evaluates mobility and positioning of pieces, particularly high-value pieces
- **King Safety**: Assesses the security of both Generals and potential threats
- **Center Control**: Prioritizes control of key central positions
- **Pawn Structure**: Analyzes pawn formations and advancement opportunities
- **Tactical Opportunities**: Identifies potential captures, forks, pins, and other tactical motifs

### Technical Implementation
```typescript
// The AI processes each move through these steps:
1. Convert current board state to FEN notation
2. Generate a strategic analysis prompt
3. Process through GPT model with temperature 0.4 for consistent play
4. Validate returned moves using UCI format
5. Execute validated moves on the game board
```

### Difficulty Levels
The AI supports multiple difficulty settings through different strategic prompts:
- Beginner: Makes simple moves with occasional minor mistakes
- Intermediate: Employs basic tactics and solid strategic principles
- Advanced: Focuses on deep tactical analysis and optimal play

The AI's responses are structured in JSON format, ensuring consistent and valid move generation while maintaining strategic depth in gameplay.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your PR adheres to the following guidelines:
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Verify all tests pass

## License

MIT License


## Future Improvements

- [x] Implement AI opponent using GPT models
- [x] Create responsive web interface
- [ ] Add multiplayer support via WebSocket
- [ ] Include game history and replay features
- [ ] Add tournament mode with ELO rating system
- [ ] Implement move explanation feature
- [ ] Add support for multiple languages
- [ ] Create a learning mode for beginners
- [ ] Optimize API usage and response times
- [ ] Add game state persistence

---

<div align="center">
  <a href="https://www.xiangqi.com/rules" 
     class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 px-4 py-2">
    规则说明 (Game Rules)
  </a>
</div>
