import {
  BoardState,
  getPieceColor,
  isBlack,
  isRed,
  Piece,
  PlayerColor,
  Position,
} from "../GameTypes";
import { PIECE_VALUES, POSITION_BONUS } from "./value_table";

const RED_ADVISOR_POSITIONS: Position[] = [
  { x: 3, y: 7 },
  { x: 5, y: 7 },
  { x: 4, y: 8 },
  { x: 3, y: 9 },
  { x: 5, y: 9 },
];

const RED_ELEPHANT_POSITIONS: Position[] = [
  { x: 2, y: 5 },
  { x: 6, y: 5 },
  { x: 4, y: 7 },
  { x: 2, y: 9 },
  { x: 6, y: 9 },
];

const BLACK_ADVISOR_POSITIONS: Position[] = [
  { x: 3, y: 0 },
  { x: 5, y: 0 },
  { x: 4, y: 1 },
  { x: 3, y: 2 },
  { x: 5, y: 2 },
];

const BLACK_ELEPHANT_POSITIONS: Position[] = [
  { x: 2, y: 0 },
  { x: 6, y: 0 },
  { x: 4, y: 2 },
  { x: 2, y: 4 },
  { x: 6, y: 4 },
];

export class Evaluator {
  public evaluate(state: BoardState): number {
    let score = 0;

    // Material evaluation
    score += this.evaluateMaterial(state);

    // Position evaluation
    score += this.evaluatePositions(state);

    // Mobility evaluation
    score += this.evaluateMobility(state);

    // King safety evaluation
    score += this.evaluateKingSafety(state);

    return state.currentTurn === "red" ? score : -score;
  }

  private evaluateMaterial(state: BoardState): number {
    let score = 0;

    for (let y = 0; y < state.board.length; y++) {
      for (let x = 0; x < state.board[y].length; x++) {
        const piece = state.board[y][x];
        if (piece) {
          const value = PIECE_VALUES[piece];
          score += isRed(piece) ? value : -value;
        }
      }
    }

    return score;
  }

  private evaluatePositions(state: BoardState): number {
    let score = 0;

    for (let y = 0; y < state.board.length; y++) {
      for (let x = 0; x < state.board[y].length; x++) {
        const piece = state.board[y][x];
        if (piece) {
          const positionBonus = this.getPositionBonus(piece, { x, y });
          score += isRed(piece) ? positionBonus : -positionBonus;
        }
      }
    }

    return score;
  }

  private getPositionBonus(piece: Piece, position: Position): number {
    const bonusTable =
      POSITION_BONUS[piece.toLowerCase() as keyof typeof POSITION_BONUS];
    if (!bonusTable) return 0;
    const red = isRed(piece);
    const x = position.x;
    const y = red ? 9 - position.y : position.y;
    const score = bonusTable[y][x];
    return red ? score : -score;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private evaluateMobility(state: BoardState): number {
    // Implement mobility evaluation
    return 0;
  }

  private evaluateKingSafety(state: BoardState): number {
    let score = 0;
    const redKingPos = this.findKing(state.board, "K");
    const blackKingPos = this.findKing(state.board, "k");

    if (!redKingPos || !blackKingPos) return 0;

    // Evaluate protection around kings
    score += this.evaluateKingProtection(state.board, redKingPos);
    score -= this.evaluateKingProtection(state.board, blackKingPos);

    // Penalize exposed kings (kings that are on open files)
    score += this.evaluateKingExposure(state.board, redKingPos, true);
    score -= this.evaluateKingExposure(state.board, blackKingPos, false);

    return score;
  }

  private findKing(
    board: (Piece | null)[][],
    kingPiece: "K" | "k"
  ): Position | null {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x] === kingPiece) {
          return { x, y };
        }
      }
    }
    return null;
  }

  private evaluateKingProtection(
    board: (Piece | null)[][],
    kingPos: Position
  ): number {
    let protection = 0;

    const king = board[kingPos.y][kingPos.x];
    if (!king) return 0;
    // Check adjacent squares for protectors
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const x = kingPos.x + dx;
      const y = kingPos.y + dy;
      if (x >= 0 && x < 9 && y >= 0 && y < 10) {
        const piece = board[y][x];
        if (piece && king) {
          const isSameColor = getPieceColor(piece) === getPieceColor(king);
          if (isSameColor) {
            protection += 10; // Bonus for each protecting piece
          }
        }
      }
    }

    const isRed = getPieceColor(king) === "red";
    const advisorPositions = isRed
      ? RED_ADVISOR_POSITIONS
      : BLACK_ADVISOR_POSITIONS;
    const elephantPositions = isRed
      ? RED_ELEPHANT_POSITIONS
      : BLACK_ELEPHANT_POSITIONS;
    const advisor = isRed ? "A" : "a";
    const elephant = isRed ? "E" : "e";

    // Extra bonus for advisors and elephants in proper positions

    // Check advisors in the palace
    for (const pos of advisorPositions) {
      if (board[pos.y][pos.x] === advisor) {
        protection += 15;
      }
    }

    // Check elephants in defensive positions
    for (const pos of elephantPositions) {
      if (board[pos.y][pos.x] === elephant) {
        protection += 10;
      }
    }

    return protection;
  }

  private evaluateKingExposure(
    board: (Piece | null)[][],
    kingPos: Position,
    isRed: boolean
  ): number {
    // Determine the range to check between the kings
    const [start, end, step] = isRed
      ? [kingPos.y - 1, 0, -1] // Red king: check upward
      : [kingPos.y + 1, 9, 1]; // Black king: check downward

    let blockers = 0;

    // Count pieces between the current king and the opposite edge
    for (let y = start; isRed ? y >= end : y <= end; y += step) {
      if (board[y][kingPos.x] !== null) {
        blockers++;
        // Early exit if we already have enough protection
        if (blockers >= 3) return 5; // Maximum bonus for well-protected king
      }
    }

    // Return score based on number of blockers
    const exposureScores = [-30, -15, -5, 5];
    return exposureScores[blockers] !== undefined
      ? exposureScores[blockers]
      : 5;
  }
}
