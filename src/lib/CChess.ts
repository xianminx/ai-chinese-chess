import { getPieceColor, PlayerColor, type ChessState, type Piece, type Position } from './GameTypes';
import { isValidMove } from '@/lib/moveValidation';
import { char2piece, piece2char } from './util';

function initGame(): ChessState {
  return {
      board: initializeBoard(),
      selectedPosition: null,
      lastMove: null,
      currentTurn: 'red',
      gameStatus: 'active'
  };
}

function initializeBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(10)
      .fill(null)
      .map(() => Array(9).fill(null));

  // Initialize the board with pieces
  // Black pieces (top)
  board[0][0] = "r";
  board[0][1] = "h";
  board[0][2] = "e";
  board[0][3] = "a";
  board[0][4] = "k";
  board[0][5] = "a";
  board[0][6] = "e";
  board[0][7] = "h";
  board[0][8] = "r";

  // Black cannons
  board[2][1] = "c";
  board[2][7] = "c";

  // Black pawns
  board[3][0] = "p";
  board[3][2] = "p";
  board[3][4] = "p";
  board[3][6] = "p";
  board[3][8] = "p";

  // Red pawns
  board[6][0] = "P";
  board[6][2] = "P";
  board[6][4] = "P";
  board[6][6] = "P";
  board[6][8] = "P";

  // Red cannons
  board[7][1] = "C";
  board[7][7] = "C";

  // Red pieces (bottom)
  board[9][0] = "R";
  board[9][1] = "H";
  board[9][2] = "E";
  board[9][3] = "A";
  board[9][4] = "K";
  board[9][5] = "A";
  board[9][6] = "E";
  board[9][7] = "H";
  board[9][8] = "R";

  return board;
}

export class CChess {
  private gameState: ChessState;

  constructor(initialState?: ChessState) {
    this.gameState = initialState || initGame();
  }

  public getGameState(): ChessState {
    return {
      ...this.gameState,
      board: this.gameState.board.map(row => [...row])
    };
  }

  public selectPiece(position: Position | null): void {
    this.gameState.selectedPosition = position;
  }

  public isValidMove(from: Position, to: Position): boolean {
    const result = isValidMove(this.gameState, from, to);
    return result.isValid;
  }

  public movePiece(from: Position, to: Position): void {
    const newBoard = this.gameState.board.map(row => [...row]);
    const piece = newBoard[from.y][from.x];

    newBoard[to.y][to.x] = piece;
    newBoard[from.y][from.x] = null;

    const nextTurn = this.gameState.currentTurn === 'red' ? 'black' : 'red';
    
    // Check if the opponent's king is in check
    const isCheck = this.isKingInCheck(newBoard, nextTurn);

    this.gameState = {
      ...this.gameState,
      lastMove: [from, to],
      board: newBoard,
      selectedPosition: null,
      currentTurn: nextTurn,
      gameStatus: isCheck ? 'check' : 'active',
    };
  }

  public reset(): void {
    this.gameState = initGame();
  }

  public static toFen(gameState: ChessState): string {
    const rows: string[] = gameState.board.map(row => {
      let rowString = '';
      let emptyCount = 0;

      for (const piece of row) {
        if (piece) {
          if (emptyCount > 0) {
            rowString += emptyCount.toString();
            emptyCount = 0;
          }
          rowString += piece2char(piece);
        } else {
          emptyCount++;
        }
      }
      if (emptyCount > 0) {
        rowString += emptyCount.toString();
      }
      return rowString;
    });

    const turn = gameState.currentTurn === 'red' ? 'r' : 'b';
    return `${rows.join('/')} ${turn} - - 0 1`;
  }

  public static fromFen(fen: string): ChessState {
    const [boardPart, turn] = fen.split(' ');
    const board: (Piece | null)[][] = Array(10).fill(null).map(() => Array(9).fill(null));

    const rows = boardPart.split('/');
    for (let y = 0; y < rows.length; y++) {
      let x = 0;
      for (const char of rows[y]) {
        if (isNaN(Number(char))) {
          const piece: Piece = char2piece(char);
          board[y][x++] = piece;
        } else {
          x += Number(char);
        }
      }
    }

    return {
      board: board,
      lastMove: null,
      selectedPosition: null,
      currentTurn: turn === 'r' ? 'red' : 'black',
      gameStatus: 'active'
    };
  }

  private isKingInCheck(board: (Piece | null)[][], kingColor: PlayerColor): boolean {
    // First find the king's position
    let kingPos: Position | null = null;
    const kingPiece = kingColor === 'red' ? 'K' : 'k';
    
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === kingPiece) {
          kingPos = { x, y };
          break;
        }
      }
      if (kingPos) break;
    }

    if (!kingPos) return false;

    // Check if any opponent piece can capture the king
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const piece = board[y][x];
        if (piece && getPieceColor(piece) !== kingColor) {
          const from: Position = { x, y };
          const result = isValidMove(
            { ...this.gameState, board },
            from,
            kingPos
          );
          if (result.isValid) {
            return true;
          }
        }
      }
    }

    return false;
  }
}


