import { useState } from "react";

interface CompoundObjct {
    lastKey: string;
    mapCount: number;
    map: Map<string, number>;
}

export function Counter() {
    const obj: CompoundObjct = {
        lastKey: "b",
        mapCount: 2,
        map: new Map([
            ["a", 1],
            ["b", 2],
        ]),
    };

    const [state, setState] = useState(obj);

    const addItem = () => {
        const newKey = String.fromCharCode(state.lastKey.charCodeAt(0) + 1);
        setState({
            ...state,
            map: new Map([...state.map, [newKey, state.mapCount]]),
            lastKey: newKey,
        });
    }


    return (
        <div>
            <button
                onClick={addItem}
            >
                Add Item
            </button>
            <div>
                <div>Map Count: {state.mapCount}</div>
                <div>Map size: {state.map.size}</div>
                {Array.from(state.map.entries()).map(([key, value]) => (
                    <div key={key}>
                        {key}: {value}
                    </div>
                ))}
            </div>
        </div>
    );
}
