import { MoveSuggestion } from "./AIEngine";
import { SettingsType } from "@/components/providers/SettingsProvider";
import { BoardState } from "../engine/types";
import { AIEngine } from "./AIEngine";
import { MinimaxEngine } from "./MinimaxEngine";
import { LlmEngine } from "./LlmEngine";

const AI_ENGINES: Record<string, AIEngine> = {
    MINIMAX: new MinimaxEngine(),
    LLM: new LlmEngine(),
};

export type EngineType = keyof typeof AI_ENGINES;

function getAIEngine(engineType: EngineType): AIEngine {
    return AI_ENGINES[engineType] || AI_ENGINES["MINIMAX"];
}


export class ProxyEngine implements AIEngine {

    async findBestMove(state: BoardState, settings?: SettingsType): Promise<MoveSuggestion> {
        console.log("ProxyEngine.findBestMove", state, settings);
        const engine = getAIEngine(settings?.aiEngine || "MINIMAX");
        const result = await engine.findBestMove(state, settings);
        console.log("ProxyEngine.findBestMove result", result);
        return result;
    }
}   