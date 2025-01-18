import { BoardState, Piece, PieceType, Player, Position } from './xiangqi';

export class Evaluator {
  // Material values for pieces
  private static PIECE_VALUES: Record<PieceType, number> = {
    [PieceType.General]: 6000,
    [PieceType.Advisor]: 120,
    [PieceType.Elephant]: 120,
    [PieceType.Horse]: 270,
    [PieceType.Chariot]: 600,
    [PieceType.Cannon]: 285,
    [PieceType.Soldier]: 30
  };

  // Position bonus tables for each piece type
  private static POSITION_BONUS: Record<PieceType, number[][]> = {
    // Initialize position bonus tables for each piece type
    [PieceType.Soldier]: [
      // Example position bonus for soldiers
      [0,  0,  0,  0,  0,  0,  0,  0,  0],
      [0,  0,  0,  0,  0,  0,  0,  0,  0],
      [0,  0,  0,  0,  0,  0,  0,  0,  0],
      [2,  4,  6,  6,  6,  6,  4,  2,  0],
      [6,  8, 10, 12, 12, 10,  8,  6,  0],
      [10, 12, 14, 16, 16, 14, 12, 10, 0],
      [14, 16, 18, 20, 20, 18, 16, 14, 0],
      [18, 20, 22, 24, 24, 22, 20, 18, 0],
      [22, 24, 26, 28, 28, 26, 24, 22, 0],
      [26, 28, 30, 32, 32, 30, 28, 26, 0]
    ],
    // Add other piece position bonus tables...
  } as Record<PieceType, number[][]>;

  public evaluatePosition(state: BoardState): number {
    let score = 0;

    // Material evaluation
    score += this.evaluateMaterial(state);

    // Position evaluation
    score += this.evaluatePositions(state);

    // Mobility evaluation
    score += this.evaluateMobility(state);

    // King safety evaluation
    score += this.evaluateKingSafety(state);

    return state.currentPlayer === Player.Red ? score : -score;
  }

  private evaluateMaterial(state: BoardState): number {
    let score = 0;
    
    for (const piece of state.pieces.values()) {
      const value = Evaluator.PIECE_VALUES[piece.type];
      score += piece.player === Player.Red ? value : -value;
    }

    return score;
  }

  private evaluatePositions(state: BoardState): number {
    let score = 0;

    for (const piece of state.pieces.values()) {
      const positionBonus = this.getPositionBonus(piece);
      score += piece.player === Player.Red ? positionBonus : -positionBonus;
    }

    return score;
  }

  private getPositionBonus(piece: Piece): number {
    const bonusTable = Evaluator.POSITION_BONUS[piece.type];
    if (!bonusTable) return 0;

    const { x, y } = piece.position;
    return bonusTable[piece.player === Player.Red ? y : 9 - y][x];
  }

  private evaluateMobility(state: BoardState): number {
    // Implement mobility evaluation
    return 0;
  }

  private evaluateKingSafety(state: BoardState): number {
    // Implement king safety evaluation
    return 0;
  }
}