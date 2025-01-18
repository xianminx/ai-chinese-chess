import {
  getPieceColor,
  Move,
  PlayerColor,
  type BoardState,
  type Piece,
  type Position,
} from "./GameTypes";
import { isValidMove } from "@/lib/moveValidation";
import { char2piece, piece2char } from "./util";
import { clearChessState, loadChessState, saveChessState } from "./storage";
import { isBrowser } from "./browserUtils";

function initGame(): BoardState {
  return {
    board: initializeBoard(),
    selectedPosition: null,
    currentTurn: "red",
    gameStatus: "active",
    moveHistory: []
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
  private state: BoardState;

  constructor() {
    // Initialize with a new game state by default
    this.state = initGame();

    // Try to load saved state in browser environment
    if (isBrowser()) {
      const savedState = loadChessState();
      if (savedState) {
        this.state = savedState;
      }
    }
  }

  public setGameState(state: BoardState): void {
    this.state = state;
  }

  public getGameState(): BoardState {
    return {
      ...this.state,
      board: this.state.board.map((row) => [...row]),
    };
  }

  public selectPiece(position: Position | null): void {
    console.log("selectPiece", position);
    this.state.selectedPosition = position;
    saveChessState(this.state);
  }

  public makeMove(move: Move): void {
    if (!this.isValidMove(move)) {
      throw new Error("Invalid move");
    }

    // Get the piece at the starting position
    const piece = this.state.board[move.from.y][move.from.x];
    if (!piece) return;

    // Create new board with the move applied
    const newBoard = this.state.board.map((row) => [...row]);

    // Store captured piece for move history
    const capturedPiece = newBoard[move.to.y][move.to.x];

    // Make the move
    newBoard[move.to.y][move.to.x] = piece;
    newBoard[move.from.y][move.from.x] = null;

    // Update move history and state
    const moveWithCapture = {
      ...move,
      capturedPiece: capturedPiece || undefined,
    };
    this.state.moveHistory.push(moveWithCapture);
    this.state.board = newBoard;
    this.toggleTurn();

    // Save the updated state
    saveChessState(this.state);
  }

  public undoMove(): void {
    const lastMove = this.state.moveHistory.pop();
    if (!lastMove) return;

    // Create new board
    const newBoard = this.state.board.map((row) => [...row]);

    // Get the piece at the current position
    const piece = newBoard[lastMove.to.y][lastMove.to.x];
    if (!piece) return;

    // Move piece back to original position
    newBoard[lastMove.from.y][lastMove.from.x] = piece;

    // Restore captured piece if any
    if (lastMove.capturedPiece) {
      newBoard[lastMove.to.y][lastMove.to.x] = lastMove.capturedPiece;
    } else {
      newBoard[lastMove.to.y][lastMove.to.x] = null;
    }

    // Update game state
    this.state.board = newBoard;
    this.toggleTurn();

    // Save the updated state
    saveChessState(this.state);
  }

  public movePiece(from: Position, to: Position): void {
    const newBoard = this.state.board.map((row) => [...row]);
    const piece = newBoard[from.y][from.x];

    newBoard[to.y][to.x] = piece;
    newBoard[from.y][from.x] = null;

    const nextTurn = this.toggleTurn();

    // Check if the opponent's king is in check
    const isCheck = this.isKingInCheck(newBoard, nextTurn);

    this.state = {
      ...this.state,
      board: newBoard,
      selectedPosition: null,
      currentTurn: nextTurn,
      gameStatus: isCheck ? "check" : "active",
    };
    saveChessState(this.state);
  }

  public reset(): void {
    clearChessState();
    this.state = initGame();
  }

  public static toFen(gameState: BoardState): string {
    const rows: string[] = gameState.board.map((row) => {
      let rowString = "";
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

    const turn = gameState.currentTurn === "red" ? "r" : "b";
    return `${rows.join("/")} ${turn} - - 0 1`;
  }

  public static fromFen(fen: string): BoardState {
    const [boardPart, turn] = fen.split(" ");
    const board: (Piece | null)[][] = Array(10)
      .fill(null)
      .map(() => Array(9).fill(null));

    const rows = boardPart.split("/");
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
      selectedPosition: null,
      currentTurn: turn === "r" ? "red" : "black",
      gameStatus: "active",
      moveHistory: []
    };
  }

  public isValidMove(move: Move): boolean {
    const result = isValidMove(this.state, move.from, move.to);
    return result.isValid;
  }

  private isKingInCheck(
    board: (Piece | null)[][],
    kingColor: PlayerColor
  ): boolean {
    // First find the king's position
    let kingPos: Position | null = null;
    const kingPiece = kingColor === "red" ? "K" : "k";

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
            { ...this.state, board },
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

  private toggleTurn(): PlayerColor {
    const turn = this.state.currentTurn;
    const nextTurn = turn === "red" ? "black" : "red";
    this.state.currentTurn = nextTurn;
    return nextTurn;
  }

  public getLegalMoves(): Move[] {
    // Implement the logic to generate and return all legal moves
    return this.generateLegalMoves();
  }

  private generateLegalMoves(): Move[] {
    const legalMoves: Move[] = [];
    // Your move generation logic here
    return legalMoves;
  }
}
