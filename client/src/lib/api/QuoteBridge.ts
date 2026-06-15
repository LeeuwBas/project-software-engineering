import { getAPI } from '@/lib/api/ApiManager';

export interface QuoteBridge {
    getQuote: (mood: number, action: string) => Promise<string | null>;
}

export function createQuoteBridge(): QuoteBridge {
    return {
        getQuote: async (mood: number, action: string) => {
            const data = await getAPI(
                `api/get-quote/?mood=${mood}&action=${encodeURIComponent(action)}`
            );
            return data?.quote ?? null;
        },
    };
}
