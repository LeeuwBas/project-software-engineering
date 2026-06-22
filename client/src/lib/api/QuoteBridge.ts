import { getAPI } from '@/lib/api/ApiManager';
import { calculateQuoteRequest } from '@/lib/quotes/calculateQuoteRequest';
import { useSyncExternalStore } from 'react';

const DEFAULT_QUOTE_DURATION_MS: number = 5000;

// Subsciber/publisher model to store what quote is displayed currently
let currentQuote: string | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const subscribers = new Set<() => void>();
const emit = () => subscribers.forEach((cb) => cb());

// use anywhere to subscribe to the quotes module
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
