import { createFoodBridge } from '@/lib/api/FoodBridge';
import { loadCalender } from '@/lib/api/GenericStorage';
import { createQuoteBridge, QuoteBridge } from '@/lib/api/QuoteBridge';
import { createSleepBridge } from '@/lib/api/SleepBridge';
import { createStepBridge } from '@/lib/api/StepBridge';
import { createWaterBridge } from '@/lib/api/WaterBridge';
import { StatisticsSummary } from '@/lib/storage';
import { createStressBridge } from './StressBridge';

/** TODO (LeeuwBas): docstring */
export type LoadableBridge<T> = T & Loadable;

/** TODO (LeeuwBas): docstring */
export interface Loadable {
    load: () => Promise<any>;
}

/**
 * Interface to define all functions needed to use the statistics.
 */
export interface StatisticBridge {
    useCurrent: () => number | null;
    set: (value: number, date?: Date) => Promise<any>;
    getBarChart?: (bins: number, daysPerBin: number, endDate?: Date) => Promise<number[]>;
    getSummary?: (startDate: Date, endDate: Date) => Promise<StatisticsSummary | null>;
}

/**
 * Interface extension to add support for goal bridges.
 */
export interface GoaledStatisticBridge extends StatisticBridge {
    getBarChart: (bins: number, daysPerBin: number, endDate?: Date) => Promise<number[]>;
    getSummary: (startDate: Date, endDate: Date) => Promise<StatisticsSummary | null>;
    getGoal: (date?: Date) => Promise<number>;
    setGoal: (value: number, date?: Date) => Promise<any>;
    useGoal: () => number | null;
}

// TODO (LeeuwBas): explain
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
    ).then(() => {
        initPromise = null;
    })); // Map to void promise
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

/* Api bridges all in one place, ensuring they are loaded and can easily be imported. */

export const waterBridge = register(createWaterBridge());
export const stressBridge = register(createStressBridge());

/**{@link QuoteBridge}*/
export const quoteBridge: QuoteBridge = createQuoteBridge();
export const stepsBridge = register(createStepBridge());
export const sleepBridge = register(createSleepBridge());
export const foodBridge = register(createFoodBridge());
