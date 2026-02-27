import { useState, useCallback, useRef } from "react";

const MAX_HISTORY = 50;

/**
 * useCanvasHistory — manages an undo/redo stack of canvas element snapshots.
 *
 * Usage:
 *   const { pushState, undo, redo, canUndo, canRedo } = useCanvasHistory(setElements);
 *
 * Call pushState(currentElements) after every discrete change (add, delete, move-end, resize-end).
 * undo() / redo() automatically call setElements with the correct snapshot.
 */
export default function useCanvasHistory(setElements) {
    // history[0] is always the initial empty state
    const [history, setHistory] = useState([[]]);
    const [index, setIndex] = useState(0);

    // Ref mirrors index so callbacks that close over stale state still work
    const indexRef = useRef(0);
    const historyRef = useRef([[]]);

    const pushState = useCallback(
        (elements) => {
            setHistory((prev) => {
                // Truncate any forward (redo) branch
                const base = prev.slice(0, indexRef.current + 1);
                const next = [...base, elements.map((el) => ({ ...el }))];
                // Cap at MAX_HISTORY
                const trimmed = next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next;
                historyRef.current = trimmed;
                return trimmed;
            });
            setIndex((prev) => {
                const newIdx = Math.min(prev + 1, MAX_HISTORY - 1);
                indexRef.current = newIdx;
                return newIdx;
            });
        },
        []
    );

    const undo = useCallback(() => {
        if (indexRef.current <= 0) return;
        const newIdx = indexRef.current - 1;
        indexRef.current = newIdx;
        setIndex(newIdx);
        const snapshot = historyRef.current[newIdx];
        setElements(snapshot.map((el) => ({ ...el })));
    }, [setElements]);

    const redo = useCallback(() => {
        if (indexRef.current >= historyRef.current.length - 1) return;
        const newIdx = indexRef.current + 1;
        indexRef.current = newIdx;
        setIndex(newIdx);
        const snapshot = historyRef.current[newIdx];
        setElements(snapshot.map((el) => ({ ...el })));
    }, [setElements]);

    const canUndo = index > 0;
    const canRedo = index < history.length - 1;

    return { pushState, undo, redo, canUndo, canRedo };
}
