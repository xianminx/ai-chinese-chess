import { NextResponse } from 'next/server';
import { gameInstance } from '@/lib/CChess';
import type { MoveRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: MoveRequest = await request.json();
    const { from_square, to_square } = body;

    const success = gameInstance.make_move(from_square, to_square);

    if (success) {
      return NextResponse.json({
        success: true,
        board: gameInstance.get_board(),
        current_turn: gameInstance.get_current_turn(),
        game_status: gameInstance.get_game_status(),
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error processing move:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 400 }
    );
  }
} 