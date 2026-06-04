import { HistoryPeriod } from '@/components/stats/statistics-types';

export function getChartLabels(
  period: HistoryPeriod,
  binCount: number,
): string[] {
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
