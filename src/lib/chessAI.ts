import { Configuration, OpenAIApi } from 'openai'
import { Chess } from 'chess.js'

type Difficulty = 'beginner' | 'intermediate' | 'advanced'
type Move = [string, string] | null // [from, to] squares or null

export class ChessAI {
    private client: OpenAIApi
    private difficulty: Difficulty

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
        })
        this.client = new OpenAIApi(configuration)
        this.difficulty = 'intermediate'
    }

    async getMove(board: Chess): Promise<Move> {
        try {
            const fen = board.fen()
            const legalMoves = board.moves({ verbose: true })
                .map(move => move.from + move.to)
            
            const prompt = this.createPrompt(fen, legalMoves)
            
            const response = await this.client.createChatCompletion({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: this.getSystemPrompt() },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.4,
                max_tokens: 100
            })

            const aiMove = response.data.choices[0]?.message?.content?.trim()
            
            // Validate move format
            if (aiMove && aiMove.length >= 4 && legalMoves.includes(aiMove.slice(0, 4))) {
                return [aiMove.slice(0, 2), aiMove.slice(2, 4)]
            }
            return null

        } catch (e) {
            console.error('Error getting AI move:', e)
            return null
        }
    }

    private getSystemPrompt(): string {
        const difficultyPrompts = {
            beginner: 'You are a beginner-level chess engine that occasionally makes minor mistakes.',
            intermediate: 'You are an intermediate-level chess engine that plays solid, strategic moves.',
            advanced: 'You are an advanced chess engine that plays strong, tactical moves.'
        }
        return difficultyPrompts[this.difficulty]
    }

    private createPrompt(fen: string, legalMoves: string[]): string {
        return `
        Current position (FEN): ${fen}
        Legal moves: ${legalMoves.join(', ')}

        Analyze the position and select a move from the legal moves list.
        Consider:
        1. Material balance
        2. Piece activity and development
        3. King safety
        4. Control of center
        5. Pawn structure

        Respond only with the chosen move in UCI format (e.g., 'e2e4').
        `
    }

    setDifficulty(level: Difficulty): void {
        this.difficulty = level
    }
} 