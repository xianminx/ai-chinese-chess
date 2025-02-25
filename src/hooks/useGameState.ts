'use client';

import { useState, useCallback, useEffect } from "react";
import cchess from "../lib/engine/cchess";
import { BoardState, Move } from "../lib/engine/types";
import { loadChessState, saveChessState } from "@/lib/storage";
import { isBrowser } from "@/lib/browserUtils";

export const useGameState = () => {
    const [state, setState] = useState<BoardState>(cchess.initGame());

    // init game state from storage in browser environment
    useEffect(() => {
        if (isBrowser()) {
            const savedState = loadChessState();
            console.log("savedState", savedState);
            if (savedState) {
                setState(savedState);
            }
        }
    }, []);

    const handleMove = useCallback(
        (move: Move) => {
            if (cchess.isValidMove(state, move)) {
                const newState = cchess.makeMove(state, move);
                setState(newState);
                saveChessState(newState);
                return true;
            }
            console.log("invalid move", move.from, move.to);
            return false;
        },
        [state]
    );

    const handleReset = useCallback(() => {
        const newState = cchess.initGame(); 
        setState(newState);
        saveChessState(newState);
    }, []);

    const handleUndo = useCallback(() => {
        const newState = cchess.undoMove(state);
        setState(newState);
        saveChessState(newState);
    }, [state]);

    return {
        state,
        onMove: handleMove,
        onReset: handleReset,
        onUndo: handleUndo,
    };
};
