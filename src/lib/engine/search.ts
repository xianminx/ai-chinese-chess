import cchess from './cchess';
import { BoardState, Move, MoveEvaluation } from './types';
import { Evaluator } from './eval/evaluation';
import { PIECE_VALUES } from './eval/valueTable';
import { cloneState } from './utils';

export class SearchEngine {
  private evaluator: Evaluator;

  constructor() {
    this.evaluator = new Evaluator();
  }

  public findBestMove(state: BoardState, maxDepth: number): MoveEvaluation {
    const alpha = -Infinity;
    const beta = Infinity;
    const clonedState = cloneState(state);
    return this.alphaBeta(clonedState, maxDepth, alpha, beta, true);
  }

  private alphaBeta(
    state: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): MoveEvaluation {
    if (depth === 0) {
      return {
        move: null,
        score: this.evaluator.evaluate(state)
      };
    }

    const moves = this.generateOrderedMoves(state);
    let bestMove: Move | null = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      const newState = cchess.makeMove(state,move);
      
      const evaluation = this.alphaBeta(
        newState,
        depth - 1,
        alpha,
        beta,
        !isMaximizing
      );

      // this.cchess.undoMove();

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

  private generateOrderedMoves(state: BoardState): Move[] {
    // Generate and order moves for better alpha-beta pruning efficiency
    const moves = this.generateLegalMoves(state);
    return this.orderMoves(state, moves);
  }

  private generateLegalMoves(state: BoardState): Move[] {
    // Implement legal move generation
    // Utilize the cchess instance to retrieve all legal moves
    return cchess.getLegalMoves(state);
  }

  private orderMoves(state: BoardState, moves: Move[]): Move[] {
    // Implement move ordering for better pruning
    // Order moves based on move history and heuristic evaluations
    return moves.sort((a, b) => {
      const aScore = this.evaluateMove(state, a);
      const bScore = this.evaluateMove(state, b);
      return bScore - aScore; // Descending order
    });
  }

  // Add a helper method to evaluate moves for ordering
  private evaluateMove(state: BoardState, move: Move): number {
    let score = 0;

    // Priority 1: Captures
    if (move.capturedPiece) {
      score += 100;
      const capturedPieceValue = PIECE_VALUES[move.capturedPiece];
      score += capturedPieceValue || 0;
    }

    // Priority 2: Checks
    if (cchess.doesMoveCauseCheck(state, move)) {
      score += 50;
    }

    // Priority 3: Historical Move Heuristics
    score += this.getHistoricalScore(state, move);

    return score;
  }


  // Placeholder for historical move scores
  private moveHistory: { [key: string]: number } = {};

  private getHistoricalScore(state: BoardState, move: Move): number {
    const key = `${move.from}-${move.to}`;
    return this.moveHistory[key] || 0;
  }
}