import { getAPI } from '@/lib/api/ApiManager';
import { useEffect, useState } from 'react';

type Quote {
    
}

export interface QuoteBridge {
    getQuote: (mood: number, action: string) => Promise<string | null>;
}


export function createQuoteBridge(): QuoteBridge {
    const [currentQuote, setCurrentQuote] = useState([0, ""]);
    const getQuote = async (mood: number, action: string) => {
            const data = await getAPI(
                `api/get-quote/?mood=${mood}&action=${encodeURIComponent(action)}`
            );
            return data?.quote ?? null;
        }
    useEffect(() => {
        getQuote()

        return () => {

        };
    }, []);
    return {
        ,
    };
}
