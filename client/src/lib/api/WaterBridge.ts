import {create} from "zustand";
import {LoadableBridge} from "@/lib/api/APIBridge";

// Use the water bridge when the values need to be manipulated.
export interface WaterBridge {
    addWater: (value: number) => Promise<number>,
}

type WaterState = {
  water: number|undefined;
  setWater: (value: number) => void;
};

const waterState = create<WaterState>((set) => ({
  water: undefined,
  setWater: (value) => set({ water: value }),
}));

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
    return waterState(((s) => s.water));
}

export function createWaterBridge(): LoadableBridge<WaterBridge> {
    return {
        load,
        addWater,
    };
}

async function load() {
    if (waterState.getState().water !== undefined) {
        throw Error("Water already loaded")
    }

    // TODO: load from new storage impl and API endpoints
    const loadedWater = Math.round(Math.random() * 100)
    waterState.getState().setWater(loadedWater);
    return loadedWater;
}

async function addWater(value: number) {
    const current_water = waterState.getState().water;

    if (current_water === undefined) {
        throw Error("Water not loaded yet")
    }

    const new_water = Math.max(Math.min(current_water + value, 100), 0);
    waterState.getState().setWater(new_water)
    return new_water;
}
