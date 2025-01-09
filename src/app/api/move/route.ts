import { NextResponse } from "next/server";
import type { ChessState } from "@/lib/GameTypes";
import { ChessAI } from "./chessAI";

export async function POST(request: Request) {
    try {
        const chessState: ChessState = await request.json();

        const ai = new ChessAI();
        const move = await ai.getMove(chessState);

        if (!move) {
            return NextResponse.json(
                { success: false, error: "No move found" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            move: move,
        });
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
