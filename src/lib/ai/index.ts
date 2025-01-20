import { type AIEngine } from "./AIEngine";
import { MinimaxEngine } from "./MinimaxEngine";
import { LlmEngine } from "./LlmEngine";
import { ProxyEngine } from "./ProxyEngine";

const proxyEngine = new ProxyEngine();

export function getAIEngine(): AIEngine {
    return proxyEngine;
}

export { type AIEngine, LlmEngine, MinimaxEngine, ProxyEngine };
