import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt, getGameStatePrompt } from "../move/prompts";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, gameState } = await request.json();

    if (!message || !gameState) {
      return NextResponse.json(
        { error: "Message and game state are required" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt();
    const gameStatePrompt = getGameStatePrompt(gameState);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: gameStatePrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiMessage = completion.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          success: false,
          error: `OpenAI API error: ${error.message}`,
        },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
} 