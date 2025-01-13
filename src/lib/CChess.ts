import type { ChessState, Piece, Position } from './GameTypes';
import { isValidMove } from '@/lib/moveValidation';
import { char2piece, LEGAL_PIECES, piece2char } from './util';

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
  board[0][0] = LEGAL_PIECES["r"];
  board[0][1] = LEGAL_PIECES["n"];
  board[0][2] = LEGAL_PIECES["b"];
  board[0][3] = LEGAL_PIECES["a"];
  board[0][4] = LEGAL_PIECES["k"];
  board[0][5] = LEGAL_PIECES["a"];
  board[0][6] = LEGAL_PIECES["b"];
  board[0][7] = LEGAL_PIECES["n"];
  board[0][8] = LEGAL_PIECES["r"];

  // Black cannons
  board[2][1] = LEGAL_PIECES["c"];
  board[2][7] = LEGAL_PIECES["c"];

  // Black pawns
  board[3][0] = LEGAL_PIECES["p"];
  board[3][2] = LEGAL_PIECES["p"];
  board[3][4] = LEGAL_PIECES["p"];
  board[3][6] = LEGAL_PIECES["p"];
  board[3][8] = LEGAL_PIECES["p"];

  // Red pawns
  board[6][0] = LEGAL_PIECES["P"];
  board[6][2] = LEGAL_PIECES["P"];
  board[6][4] = LEGAL_PIECES["P"];
  board[6][6] = LEGAL_PIECES["P"];
  board[6][8] = LEGAL_PIECES["P"];

  // Red cannons
  board[7][1] = LEGAL_PIECES["C"];
  board[7][7] = LEGAL_PIECES["C"];

  // Red pieces (bottom)
  board[9][0] = LEGAL_PIECES["R"];
  board[9][1] = LEGAL_PIECES["N"];
  board[9][2] = LEGAL_PIECES["B"];
  board[9][3] = LEGAL_PIECES["A"];
  board[9][4] = LEGAL_PIECES["K"];
  board[9][5] = LEGAL_PIECES["A"];
  board[9][6] = LEGAL_PIECES["B"];
  board[9][7] = LEGAL_PIECES["N"];
  board[9][8] = LEGAL_PIECES["R"];

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

  private isKingInCheck(board: (Piece | null)[][], kingColor: 'red' | 'black'): boolean {
    // First find the king's position
    let kingPos: Position | null = null;
    const kingPiece = kingColor === 'red' ? 'K' : 'k';
    
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x]?.char === kingPiece) {
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
        if (piece && piece.color !== kingColor) {
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


