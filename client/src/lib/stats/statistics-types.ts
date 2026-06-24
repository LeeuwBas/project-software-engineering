export interface StatisticResponse {
    today: number;
    days_per_bin: number;
    bins: Record<string, number>;
    average: number;
    high: number;
    low: number;
}

export type HistoryPeriod = 'week' | 'month' | 'year';

export const PERIOD_CONFIG: Record<HistoryPeriod, any> = {
    week: {
        days: 7,
        bins: 7,
    },
    month: {
        days: 28,
        bins: 4,
    },
    year: {
        days: 360,
        bins: 12,
    },
};
