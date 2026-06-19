import { getAPI } from '@/lib/api/ApiManager';
import { getCurrentGoal, getStat } from '@/lib/storage';
import { useSyncExternalStore } from 'react';

const DEFAULT_QUOTE_DURATION_MS: number = 5000;

// useState/useRef were executing outside a component and scrambling the hook order.
let currentQuote: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const subscribers = new Set<() => void>();
const emit = () => subscribers.forEach((cb) => cb());

export function useQuote(): string | null {
    return useSyncExternalStore(
        (cb) => {
            subscribers.add(cb);
            return () => subscribers.delete(cb);
        },
        () => currentQuote
    );
}

/**
 * @property {@link quote} readonly useState value that stores the current quote or null.
 * @function {@link requestQuote} request a quote from the backend, sets quote when the request returns.
 * @functoin {@link setQuote} manually set the quote.
 * @function {@link removeQuote} sets quote to null.
 */

export interface QuoteBridge {
    /**
     * A state variable you can subscribe to with useEffect to display a quote.
     * Is null when there is no quote.
     */
    readonly quote: string | null;
    /**
     * DO NOT AWAIT THIS FUNCTION.
     * Request a quote from the database, when the request returns it will update {@link quote}.
     * @param mood number indicating mood for requested quote.
     * @param action string indicating action for requested quote.
     * @param durationMs duration that the quote should display if not dismissed, defaults to
     * DEFAULT_QUOTE_DURATION_MS.
     */
    requestQuote: () => void;
    /**
     * Manually set the quote.
     * @param quote string to set {@link quote} to.
     * @param durationMs duration that the quote should display if not dismissed, defaults to
     * DEFAULT_QUOTE_DURATION_MS.
     */
    setQuote: (quote: string, durationMs?: number) => void;
    /**
     * Sets {@link quote} to null. Good practice to run this in the useEffect so it runs on page load.
     */
    removeQuote: () => void;
}

/**
 * Import from APIBridge, don't call this.
 * @returns the {@link QuoteBridge} that functions as the interface for getting quotes for the whole app.
 */
export function createQuoteBridge(): QuoteBridge {
    const clearTimer = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };

    const setQuote = (q: string, durationMs: number = DEFAULT_QUOTE_DURATION_MS) => {
        clearTimer();
        currentQuote = q;
        emit();
        if (q !== null) {
            timer = setTimeout(() => {
                currentQuote = null;
                timer = null;
                emit();
            }, durationMs);
        }
    };

    const requestQuote = async () => {
        const req = await calculateQuoteRequest();
        if (req === null) return;
        const data = await getAPI(
            `/api/get-quote/?action=${encodeURIComponent(req.action)}` +
                `&level=${encodeURIComponent(req.level)}` +
                `&context=${encodeURIComponent(req.context)}`
        );
        setQuote(data?.quote ?? null);
    };

    const removeQuote = () => {
        clearTimer();
        currentQuote = null;
        emit();
    };

    return {
        get quote() {
            return currentQuote;
        },
        requestQuote,
        setQuote,
        removeQuote,
    };
}

async function getTodaysSnapshot() {
    try {
        const currentStats = await getStat(); // StatLine | null
        const currentGoals = await getCurrentGoal(null); // StatLine | number | null

        if (currentStats === null || typeof currentGoals === 'number' || currentGoals === null)
            throw Error(`stats: ${currentStats}\ngoals: ${currentGoals}`);

        return { currentStats, currentGoals };
    } catch (e) {
        console.log(`Failed to get snapshot: ${(e as Error).message}`);
    }
    return null;
}

async function isGoodWeather(): Promise<boolean> {
    return true; //TODO
}

//TODO calculate the correct quote to request
async function calculateQuoteRequest() {
    const snap = await getTodaysSnapshot();
    if (snap === null) return null;
    const { currentStats, currentGoals } = snap;

    const {
        water: waterNow,
        sleep: sleepNow,
        steps: stepsNow,
        stress: stressNow,
        food: foodNow,
    } = currentStats;

    const {
        water: waterGoal,
        sleep: sleepGoal,
        steps: stepsGoal,
        stress: stressGoal,
        food: foodGoal,
    } = currentGoals;

    const goodWeather: boolean = await isGoodWeather();

    // Low, Medium, High boundaries
    const floors = {
        water: { med: 0.33, high: 0.66 },
        sleep: { med: 0.33, high: 0.66 },
        steps: { med: 0.33, high: 0.66 },
        stress: { med: 0.33, high: 0.66, invert: true }, // high stays good
        food: { med: 0.33, high: 0.66 },
    };
    const getLevel = (
        current: number | null,
        goal: number | null,
        floors: { med: number; high: number; invert?: boolean }
    ): string | null => {
        if (current === null || goal === 0 || goal === null) return null;
        let ratio = current / goal;
        if (floors.invert ?? false) ratio = 1 - ratio;
        if (ratio < floors.med) return 'Low';
        if (ratio < floors.high) return 'Medium';
        return 'High';
    };

    const stats = [
        { action: 'Water', level: getLevel(waterNow, waterGoal, floors.water) },
        { action: 'Walk', level: getLevel(stepsNow, stepsGoal, floors.steps) },
        { action: 'Sleep', level: getLevel(sleepNow, sleepGoal, floors.sleep) },
        { action: 'Eat', level: getLevel(foodNow, foodGoal, floors.food) },
        { action: 'Stress', level: getLevel(stressNow, stressGoal, floors.stress) },
    ];

    const nonNullStats = stats.filter(
        (stat): stat is { action: string; level: string } => stat.level !== null
    );

    const priority = ['Low', 'Medium', 'High'];
    const worstLevel = priority.find((level) => nonNullStats.some((stat) => stat.level === level));
    const validStats =
        worstLevel === undefined ? [] : nonNullStats.filter((stat) => stat.level === worstLevel);
    if (validStats.length === 0) {
        console.log('no valid stats found');
        return null;
    }

    const worst = validStats[Math.floor(Math.random() * validStats.length)];

    let context = 'Standard';
    if (worst.action === 'Water' && worstLevel === 'Low') {
        if (
            nonNullStats.some(
                (stat) =>
                    stat.action === 'Walk' && (stat.level === 'High' || stat.level === 'Medium')
            )
        ) {
            context = 'Exercise';
        }
        //if weather is sunny
        else if (goodWeather) context = 'Sunny';
    }

    if (worst.action === 'Walk' && worstLevel === 'Medium' && goodWeather) {
        context = 'Sunny';
    }

    const action = worst.action;
    const level = worst.level;
    return { action, level, context };
}
