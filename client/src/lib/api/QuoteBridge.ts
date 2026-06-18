import { getAPI } from '@/lib/api/ApiManager';
import { useRef, useState } from 'react';

const DEFAULT_QUOTE_DURATION_MS: number = 5000;

/**
 * @property {@link quote} readonly useState value that stores the current quote or null.
 * @function {@link requestQuote} request a quote from the backend, sets quote when the request returns.
 * @functoin {@link setQuote} manually set the quote.
 * @function {@link removeQuote} sets quote to null.
 * @example
 * import { quoteBridge } from '@/lib/api/APIBridge';
 * useEffect(() => {
 * }, [quoteBridge.quote]);
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
    requestQuote: (mood: number, action: string, durationMs?: number) => void;
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
    const [currentQuote, setCurrentQuote] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const setQuote = (q: string, durationMs: number = DEFAULT_QUOTE_DURATION_MS) => {
        clearTimer();
        setCurrentQuote(q);
        console.log(`set quote: ${q}`);
        if (q !== null) {
            timerRef.current = setTimeout(() => {
                setCurrentQuote(null);
                timerRef.current = null;
            }, durationMs);
        }
    };

    const requestQuote = async (
        mood: number,
        action: string,
        durationMs: number = DEFAULT_QUOTE_DURATION_MS
    ) => {
        const data = await getAPI(
            `/api/get-quote/?mood=${mood}&action=${encodeURIComponent(action)}`
        );
        setQuote(data?.quote ?? null);
    };

    const removeQuote = () => {
        clearTimer();
        setCurrentQuote(null);
    };

    return {
        quote: currentQuote,
        requestQuote: requestQuote,
        setQuote: setQuote,
        removeQuote: removeQuote,
    };
}
