import { CChess } from '../CChess';
import { Move, MoveEvaluation } from '../GameTypes';
import { Evaluator } from './evaluation';

export class SearchEngine {
  private cchess: CChess;
  private evaluator: Evaluator;

  constructor(cchess: CChess) {
    this.cchess = cchess;
    this.evaluator = new Evaluator();
  }

  public findBestMove(maxDepth: number): MoveEvaluation {
    const alpha = -Infinity;
    const beta = Infinity;
    return this.alphaBeta(maxDepth, alpha, beta, true);
  }

  private alphaBeta(
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): MoveEvaluation {
    if (depth === 0) {
      return {
        move: null as any,
        score: this.evaluator.evaluate(this.cchess.getGameState())
      };
    }

    const moves = this.generateOrderedMoves();
    let bestMove: Move | null = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      this.cchess.makeMove(move);
      
      const evaluation = this.alphaBeta(
        depth - 1,
        alpha,
        beta,
        !isMaximizing
      );

      this.cchess.undoMove();

      if (isMaximizing) {
        if (evaluation.score > bestScore) {
          bestScore = evaluation.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, bestScore);
      } else {
        if (evaluation.score < bestScore) {
          bestScore = evaluation.score;
          bestMove = move;
        }
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) {
        break; // Alpha-beta cutoff
      }
    }

    return {
      move: bestMove!,
      score: bestScore
    };
  }

  private generateOrderedMoves(): Move[] {
    // Generate and order moves for better alpha-beta pruning efficiency
    const moves = this.generateLegalMoves();
    return this.orderMoves(moves);
  }

  private generateLegalMoves(): Move[] {
    // Implement legal move generation
    // Utilize the CChess instance to retrieve all legal moves
    return this.cchess.getLegalMoves();
  }

  private orderMoves(moves: Move[]): Move[] {
    // Implement move ordering for better pruning
    // Order moves based on move history and heuristic evaluations
    return moves.sort((a, b) => {
      const aScore = this.evaluateMove(a);
      const bScore = this.evaluateMove(b);
      return bScore - aScore; // Descending order
    });
  }

  // Add a helper method to evaluate moves for ordering
  private evaluateMove(move: Move): number {
    let score = 0;

    // Priority 1: Captures
    if (move.isCapture) {
      score += 100;
      const capturedPieceValue = this.valueTable[move.capturedPiece];
      score += capturedPieceValue || 0;
    }

    // Priority 2: Checks
    if (move.causesCheck) {
      score += 50;
    }

    // Priority 3: Historical Move Heuristics
    score += this.getHistoricalScore(move);

    return score;
  }

  // Example value table for piece values
  private valueTable: { [key: string]: number } = {
    'pawn': 10,
    'knight': 30,
    'bishop': 30,
    'rook': 50,
    'queen': 90,
    'king': 1000
  };

  // Placeholder for historical move scores
  private moveHistory: { [key: string]: number } = {};

  private getHistoricalScore(move: Move): number {
    const key = `${move.from}-${move.to}`;
    return this.moveHistory[key] || 0;
  }
}