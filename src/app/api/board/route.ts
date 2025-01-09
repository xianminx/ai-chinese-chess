import { NextResponse } from 'next/server';
import { gameInstance } from '@/lib/CChess';
import type { GameState } from '@/lib/types';

export async function GET() {
  try {
    const gameState: GameState = {
      board: gameInstance.get_board(),
      current_turn: gameInstance.get_current_turn(),
      game_status: gameInstance.get_game_status(),
    };

    return NextResponse.json(gameState);
  } catch (error: unknown) {
    console.error('Error getting board state:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 