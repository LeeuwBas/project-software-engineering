import { StatisticResponse } from '@/components/stats/statistics-types';

export async function fetchStatistic(
  id: string,
  days: number,
  bins: number,
): Promise<StatisticResponse> {
  // Simulate network latency
  await new Promise(resolve =>
    setTimeout(resolve, 500),
  );

  // Give each statistic its own typical range
  const ranges: Record<
    string,
    { min: number; max: number }
  > = {
    water: {
      min: 0,
      max: 12,
    },
    running: {
      min: 0,
      max: 15,
    },
  };

  const range =
    ranges[id] ?? {
      min: 0,
      max: 10,
    };

  const generatedBins: Record<
    string,
    number
  > = {};

  for (let i = 0; i < bins; i++) {
    generatedBins[i.toString()] = Number(
      (
        Math.random() *
          (range.max - range.min) +
        range.min
      ).toFixed(1),
    );
  }

  const values =
    Object.values(generatedBins);

  const average =
    values.reduce(
      (sum, value) => sum + value,
      0,
    ) / values.length;

  const high = Math.max(...values);

  const low = Math.min(...values);

  return {
    today: values[values.length - 1],
    days_per_bin: Math.floor(
      days / bins,
    ),
    bins: generatedBins,
    average: Number(
      average.toFixed(1),
    ),
    high,
    low,
  };
}