import { SearchEngine } from './search';
import cchess from './cchess';

// Initialize the game

const state = cchess.initGame();
const searchEngine = new SearchEngine();

// Example usage
const MAX_DEPTH = 4;
const bestMove = searchEngine.findBestMove(state, MAX_DEPTH);
console.log('Best move:', bestMove);