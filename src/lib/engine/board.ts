import { Position, Piece, BoardState, Move } from '../GameTypes';

export class Board {
  private state: BoardState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): BoardState {
    // Initialize empty 10x9 board
    const board = Array(10).fill(null).map(() => Array(9).fill(null));
    
    return {
      board,
      currentTurn: "red",
      moveHistory: [],
      gameStatus: "active",
      selectedPosition: null,
      lastMove: null
    };
  }

  private initializePieces(pieces: Map<string, Piece>): void {
    this.initializePlayer("red", pieces);
    this.initializePlayer("black", pieces);
    this.syncBoardFromPieces();
  }

  // New method to sync the board matrix from pieces Map
  private syncBoardFromPieces(): void {
    // Clear the board
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 9; x++) {
        this.state.board[y][x] = null;
      }
    }

    // Place pieces on board
    for (const piece of this.state.pieces.values()) {
      const { x, y } = piece.position;
      // Convert our piece type to GameTypes.Piece format (uppercase for red, lowercase for black)
      const pieceChar = piece.player === 'red' 
        ? piece.type.toUpperCase() 
        : piece.type.toLowerCase();
      this.state.board[y][x] = pieceChar as PieceType;
    }
  }

  private initializePlayer(player: "red" | "black", pieces: Map<string, Piece>): void {
    const backRank = player === "red" ? 0 : 9;
    
    // Place Chariots/Rooks
    this.addPiece(pieces, 'R', player, { x: 0, y: backRank });
    this.addPiece(pieces, 'R', player, { x: 8, y: backRank });
    
    // Place Horses
    this.addPiece(pieces, 'H', player, { x: 1, y: backRank });
    this.addPiece(pieces, 'H', player, { x: 7, y: backRank });
    
    // Add other pieces...
  }

  private addPiece(pieces: Map<string, Piece>, type: PieceType, player: "red" | "black", position: Position) {
    const piece: Piece = { type, player, position };
    pieces.set(this.getPositionKey(position), piece);
  }

  private getPositionKey(position: Position): string {
    return `${position.x},${position.y}`;
  }

  public isValidMove(move: Move): boolean {
    // Implement move validation logic based on piece type and game rules
    return true; // Placeholder
  }

  public makeMove(move: Move): void {
    if (!this.isValidMove(move)) {
      throw new Error('Invalid move');
    }

    const fromKey = this.getPositionKey(move.from);
    const toKey = this.getPositionKey(move.to);

    // Update pieces Map
    const piece = this.state.pieces.get(fromKey);
    if (!piece) return;

    this.state.pieces.delete(fromKey);
    this.state.pieces.set(toKey, { ...piece, position: move.to });

    // Sync the board matrix
    this.syncBoardFromPieces();

    // Update move history and state
    this.state.moveHistory.push(move);
    this.state.lastMove = [move.from, move.to];
    this.state.currentTurn = this.state.currentTurn === "red" ? "black" : "red";
  }

  public undoMove(): void {
    const lastMove = this.state.moveHistory.pop();
    if (!lastMove) return;

    // Restore previous position
    const fromKey = this.getPositionKey(lastMove.from);
    const toKey = this.getPositionKey(lastMove.to);

    const piece = this.state.pieces.get(toKey);
    if (!piece) return;

    this.state.pieces.delete(toKey);
    this.state.pieces.set(fromKey, { ...piece, position: lastMove.from });

    // Restore captured piece if any
    if (lastMove.capturedPiece) {
      this.state.pieces.set(toKey, lastMove.capturedPiece);
    }

    // Switch back current player
    this.state.currentTurn = 
      this.state.currentTurn === "red" ? "black" : "red";
  }
}