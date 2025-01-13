import { NextResponse } from "next/server";
import type { ChessState } from "@/lib/GameTypes";
import { ChessAI } from "./chessAI";

export async function POST(request: Request) {
    try {
        const chessState: ChessState = await request.json();
        // console.log('chessState', chessState);

        const ai = new ChessAI();
        const result = await ai.getMove(chessState);
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
