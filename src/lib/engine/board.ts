import { Position, Piece, Player, PieceType, BoardState, Move } from './xiangqi';

export class Board {
  private state: BoardState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): BoardState {
    const pieces = new Map<string, Piece>();
    // Initialize the board with starting positions
    this.initializePieces(pieces);
    
    return {
      pieces,
      currentPlayer: Player.Red,
      moveHistory: []
    };
  }

  private initializePieces(pieces: Map<string, Piece>): void {
    // Initialize Red pieces
    this.initializePlayer(Player.Red, pieces);
    // Initialize Black pieces
    this.initializePlayer(Player.Black, pieces);
  }

  private initializePlayer(player: Player, pieces: Map<string, Piece>): void {
    const backRank = player === Player.Red ? 0 : 9;
    const soldierRank = player === Player.Red ? 3 : 6;

    // Place Chariots
    pieces.set(this.getPositionKey({ x: 0, y: backRank }), {
      type: PieceType.Chariot,
      player,
      position: { x: 0, y: backRank }
    });
    pieces.set(this.getPositionKey({ x: 8, y: backRank }), {
      type: PieceType.Chariot,
      player,
      position: { x: 8, y: backRank }
    });

    // Place Horses
    pieces.set(this.getPositionKey({ x: 1, y: backRank }), {
      type: PieceType.Horse,
      player,
      position: { x: 1, y: backRank }
    });
    pieces.set(this.getPositionKey({ x: 7, y: backRank }), {
      type: PieceType.Horse,
      player,
      position: { x: 7, y: backRank }
    });

    // ... Add other pieces initialization
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

    // Update piece positions
    const piece = this.state.pieces.get(fromKey);
    if (!piece) return;

    this.state.pieces.delete(fromKey);
    this.state.pieces.set(toKey, { ...piece, position: move.to });

    // Update move history
    this.state.moveHistory.push(move);
    
    // Switch current player
    this.state.currentPlayer = 
      this.state.currentPlayer === Player.Red ? Player.Black : Player.Red;
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
    this.state.currentPlayer = 
      this.state.currentPlayer === Player.Red ? Player.Black : Player.Red;
  }
}