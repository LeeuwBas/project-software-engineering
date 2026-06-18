import { createWaterBridge } from '@/lib/api/WaterBridge';
import { createSleepBridge } from '@/lib/api/SleepBridge';
import { createFoodBridge } from '@/lib/api/FoodBridge';
import { loadCalender } from '@/lib/api/GenericStorage';
import { createStressBridge } from './StressBridge';
import { createStepBridge } from '@/lib/api/StepBridge';
import { StatisticsSummary } from '@/lib/storage';

export type LoadableBridge<T> = T & Loadable;

export interface Loadable {
    load: () => Promise<any>;
}

export interface StatisticBridge {
    useCurrent: () => number | null;
    set: (value: number, date?: Date) => Promise<any>;
    getBarChart?: (bins: number, daysPerBin: number, endDate?: Date) => Promise<number[]>;
    getSummary?: (startDate: Date, endDate: Date) => Promise<StatisticsSummary | null>;
}

export interface GoaledStatisticBridge extends StatisticBridge {
    getBarChart: (bins: number, daysPerBin: number, endDate?: Date) => Promise<number[]>;
    getSummary: (startDate: Date, endDate: Date) => Promise<StatisticsSummary | null>;
    getGoal: (date?: Date) => Promise<number>;
    setGoal: (value: number, date?: Date) => Promise<any>;
    useGoal: () => number | null;
}

const loaders: Loadable[] = [];
let initPromise: Promise<void> | null = null;

function register<T>(module: LoadableBridge<T>): T {
    loaders.push(module);
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
    return (initPromise = Promise.all(
        loaders.map((s) => {
            try {
                return s.load();
            } catch (err) {
                console.error('Could not load module: ', err);
                return Promise.resolve();
            }
        })
    ).then( () => {initPromise = null;})); // Map to void promise
}

/**
 * Get and load the calendar with the achieved goals data.
 *
 * @param startDate The first date of the calendar
 * @param endDate The last date of the calendar
 *
 * @returns An array with a dictionary for all goals indicating achievement. Or null if something
 * went TERRIBLY wrong.
 */
export async function getGoalCalender(startDate: Date, endDate: Date) {
    return await loadCalender(startDate, endDate);
}

export const waterBridge = register(createWaterBridge());
export const stressBridge = register(createStressBridge());
export const stepsBridge = register(createStepBridge());
export const sleepBridge = register(createSleepBridge());
export const foodBridge = register(createFoodBridge());
