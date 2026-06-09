import {useWater} from "@/lib/storage";

export interface WaterBridge {
    getWater: () => Promise<number>,
    addWater: (value: number) => Promise<number>,
}

export function createWaterBridge(): WaterBridge {
    return {
        getWater,
        addWater,
    };
}

async function getWater() {
    return useWater(false).water;
}

async function addWater(value: number) {
    const new_water = Math.max(Math.min(await getWater() + value, 100), 0);
    useWater(false).setWater(new_water);
    return new_water;
}
