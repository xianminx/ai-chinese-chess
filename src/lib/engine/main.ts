import { Board } from './board';
import { SearchEngine } from './search';

// Initialize the game
const board = new Board();
const searchEngine = new SearchEngine(board);

// Example usage
const MAX_DEPTH = 4;
const bestMove = searchEngine.findBestMove(MAX_DEPTH);
console.log('Best move:', bestMove);