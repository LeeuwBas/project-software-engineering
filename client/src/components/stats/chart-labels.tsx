import { HistoryPeriod } from '@/components/stats/statistics-types';

/*
Returns lables (string list) for a BarChart element,
based on the history period selected consisting of:
- week (day per bin)
- month (week per bin)
- year (month per bin)

Bins are sorted from oldest to newest data.
Last and second to last bin are automatically labeled
in the unit of the bins (eg. Today/Yesterday).
Other bins are kept implicit (no label).
*/
export function getChartLabels(
  period: HistoryPeriod,
  binCount: number,
): string[] {
  const labels = Array(binCount).fill('');

  switch (period) {
    case 'week':  // Weekly view
      if (binCount >= 2) {
        labels[binCount - 2] = 'Yesterday';
        labels[binCount - 1] = 'Today';
      }
      break;

    case 'month':  // Monthly view
      if (binCount >= 2) {
        labels[binCount - 2] = 'Last Week';
        labels[binCount - 1] = 'This Week';
      }
      break;

    case 'year':  // Yearly view
      if (binCount >= 2) {
        labels[binCount - 2] = 'Last Month';
        labels[binCount - 1] = 'This Month';
      }
      break;
  }

  return labels;
}
