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
    const currentStats = await getStat(); // StatLine | null
    const currentGoals = await getCurrentGoal(null); // StatLine | number | null

    if (currentStats === null || typeof currentGoals === 'number' || currentGoals === null)
        return null;

    return { currentStats, currentGoals };
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

    console.log(JSON.stringify(currentStats));
    console.log(JSON.stringify(currentGoals));

    const goodWeather: boolean = await isGoodWeather();

    // do the formula
    const getRatio = (current: number | null, goal: number | null): number | null => {
        return current != null && goal != null ? current / goal : null;
    };

    const waterRatio = getRatio(waterNow, waterGoal);
    const sleepRatio = getRatio(sleepNow, sleepGoal);
    const stepsRatio = getRatio(stepsNow, stepsGoal);
    const stressRatio = getRatio(stressNow, stressGoal);
    const foodRatio = getRatio(foodNow, foodGoal);

    const stats = [
        { action: 'Water', ratio: waterRatio },
        { action: 'Walk', ratio: stepsRatio },
        { action: 'Sleep', ratio: sleepRatio },
        { action: 'Eat', ratio: foodRatio },
        { action: 'Stress', ratio: stressRatio != null ? 1 - stressRatio : null }, //high and low are switched
    ];

    const validStats = stats.filter(
        (stat): stat is { action: string; ratio: number } => stat.ratio !== null
    );

    if (validStats.length === 0) {
        console.log('no valid stats found');
        return null;
    }

    //retrieve worst stat
    const minRatio = Math.min(...validStats.map((s) => s.ratio));
    const worstTied = validStats.filter((s) => s.ratio === minRatio);
    const worst = worstTied[Math.floor(Math.random() * worstTied.length)];

    const getLevel = (ratio: number) => {
        if (ratio < 0.33) return 'Low';
        if (ratio < 0.67) return 'Medium';
        return 'High';
    };

    const level = getLevel(worst.ratio);

    let context = 'Standard';
    if (worst.action === 'Water' && level === 'Low') {
        if (stepsRatio != null) {
            //if steps are low
            if (stepsRatio >= 0.8 && stepsRatio != null) context = 'Exercise';
        }
        //if weather is sunny
        else if (goodWeather) context = 'Sunny';
    }

    if (worst.action === 'Walk' && level === 'Medium' && goodWeather) {
        context = 'Sunny';
    }

    const action = worst.action;
    return { action, level, context };
}
