import { HistoryPeriod, PERIOD_CONFIG } from '@/lib/stats/statistics-types';

/**
Returns lables (string list) for a BarChart element,
based on the history period selected consisting of:
- week (day per bin)
- month (week per bin)
- year (month per bin)

Bins are sorted from oldest to newest data.

@param {HistoryPeriod} period - time period to label for
@return {string[]} list of strings containing labels
*/
export function getChartLabels(period: HistoryPeriod): string[] {
    const date = new Date();
    const binCount = PERIOD_CONFIG[period].bins;
    const labels = Array(binCount);

    function getDayLetter(date: Date): string {
        const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        return days[date.getDay()];
    }

    // Week number according to ISO-8601
    function getWeekNumber(input: Date): number {
        const d = new Date(Date.UTC(input.getFullYear(), input.getMonth(), input.getDate()));
        // Set to Thursday
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // First day of the year
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Number of full weeks to Thursday
        return 1 + Math.ceil((d.getTime() - yearStart.getTime()) / 86400000 / 7);
    }

    function getMonthLetter(date: Date): string {
        const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        return months[date.getMonth()];
    }

    switch (period) {
        case 'week':
            for (let i = 1; i <= binCount; i++) {
                labels[binCount - i] = getDayLetter(date);
                date.setDate(date.getDate() - 1);
            }
            break;

        case 'month':
            for (let i = 1; i <= binCount; i++) {
                labels[binCount - i] = getWeekNumber(date);
                date.setTime(date.getTime() - 1000 * 60 * 60 * 24 * 7);
            }
            break;

        case 'year':
            for (let i = 1; i <= binCount; i++) {
                labels[binCount - i] = getMonthLetter(date);
                date.setMonth(date.getMonth() - 1);
            }
            break;
    }

    return labels;
}
