import {LoadableBridge} from "@/lib/api/APIBridge";
import {createNewState} from "@/lib/api/ValueState";

// Use the water bridge when the values need to be manipulated.
export interface WaterBridge {
    setWater: (value: number) => Promise<number>,
}

const waterState = createNewState();

/**
 * Can be used to get and subscribe to water value changes in the UI.
 *
 * Example:
 * ```tsx
 * const water = useWater() ?? 0
 * return <AppText>{water}</AppText>
 * ```
 *
 * This will update the water value whenever it is changed internally.
 */
export function useWater() {
    return waterState(((s) => s.value));
}

export function createWaterBridge(): LoadableBridge<WaterBridge> {
    return {
        load,
        setWater: setWater,
    };
}

async function load() {
    if (waterState.getState().value !== undefined) {
        throw Error("Water already loaded")
    }

    // TODO: load from new storage impl and API endpoints
    const loadedWater = Math.round(Math.random() * 100)
    waterState.getState().setValue(loadedWater);
    return loadedWater;
}

async function setWater(value: number) {
    if (waterState.getState().value === undefined) {
        throw Error("Water not loaded yet")
    }

    const new_water = Math.max(Math.min(value, 100), 0);
    waterState.getState().setValue(new_water)
    return new_water;
}
