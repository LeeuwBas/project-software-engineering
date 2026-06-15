import { HistoryPeriod } from '@/lib/stats/statistics-types';

/**
Returns lables (string list) for a BarChart element,
based on the history period selected consisting of:
- week (day per bin)
- month (week per bin)
- year (month per bin)

Bins are sorted from oldest to newest data.
Last and second to last bin are automatically labeled
in the unit of the bins (eg. Today/Yesterday).
Other bins are kept implicit (no label).

@param {HistoryPeriod} period - time period to label for
@param {number} binCount - amount of bins to label
@return {string[]} list of strings containing labels
*/
export function getChartLabels(period: HistoryPeriod, binCount: number): string[] {
    const labels = Array(binCount).fill('');

    switch (period) {
        case 'week':
            if (binCount >= 2) {
                labels[binCount - 2] = 'Yesterday';
                labels[binCount - 1] = 'Today';
            }
            break;

        case 'month':
            if (binCount >= 2) {
                labels[binCount - 2] = 'Last Week';
                labels[binCount - 1] = 'This Week';
            }
            break;

        case 'year':
            if (binCount >= 2) {
                labels[binCount - 2] = 'Last Month';
                labels[binCount - 1] = 'This Month';
            }
            break;
    }

    return labels;
}
