import { NextResponse } from "next/server";
import type { BoardState } from "@/lib/engine/types";
import { ChessAI } from "./chessAI";

export async function POST(request: Request) {
    try {
        const { state, model }: { state: BoardState, model?: string } = await request.json();
        // console.log('chessState', chessState);

        const ai = new ChessAI();
        const result = await ai.getMove(state, model);
        return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error: unknown) {
        console.error("Error processing move:", error);
        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal Server Error",
            },
            { status: 400 }
        );
    }
}
