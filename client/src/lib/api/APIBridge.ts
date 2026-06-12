import {createWaterBridge} from "@/lib/api/WaterBridge";

export type LoadableBridge<T> = T & Loadable;

export interface Loadable {
    load: () => Promise<any>,
}

export interface StatisticBridge {
    getRaw: (date?: Date) => Promise<number>,
    set: (value: number, date?: Date) => Promise<any>
    getBarChart: (bins: number, daysPerBin: number, endDate?: Date) => Promise<number[]>,
}

const loaders: Loadable[] = [];
let initPromise: Promise<void> | null = null;

function register<T>(module: LoadableBridge<T>): T {
    loaders.push(module)
    return module;
}

/**
 * Initializes all API bridges, allowing them to load their values.
 *
 * @return The promise, which will complete when all values are loaded.
 */
export async function initializeApiManager() {
    if (initPromise) {
        return initPromise;
    }
    return initPromise = Promise.all(
        loaders.map((s) => {
            try {
                return s.load()
            } catch (err) {
                console.error("Could not load module: ", err)
                return Promise.resolve()
            }
        })
    ).then(); // Map to void promise
}

export async function getCalender(startDate: Date, endDate: Date) {

}


export const waterBridge = register(createWaterBridge());


