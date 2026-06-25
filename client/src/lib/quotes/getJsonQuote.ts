import quotes from '@/assets/quotes/quotes.json';
import { getUserName } from '@/lib/settings';

/** Local quote fetching while not logged in or while there is no internet. */
export default function getJsonQuote(req: {
    action: string;
    level: string;
    context?: string;
}): string | null {
    if (!(req.action in quotes) || !(req.level in (quotes as any)[req.action])) {
        return null;
    }

    if (!req?.context) req.context = 'Standard';

    const tier = (quotes as any)[req.action][req.level];
    const possibleQuotes: string[] = tier[req.context] ?? [];

    const selectedQuote = possibleQuotes[Math.floor(Math.random() * possibleQuotes.length)];
    const userName = getUserName();

    return selectedQuote.replaceAll('<USERNAME>', userName);
}
