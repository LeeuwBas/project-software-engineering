import { AppText } from '@/components/AppText';
import { StatisticChart } from '@/components/stats/StatisticChart';
import { Button } from '@/components/ui/button';
import { getChartLabels } from '@/lib/stats/chart-labels';
import { fetchStatistic } from '@/lib/stats/statistics-api';
import {
  HistoryPeriod,
  PERIOD_CONFIG,
  StatisticResponse,
  StatName,
  STATS,
} from '@/lib/stats/statistics-types';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export function StatisticView({ stat }: { stat: StatName }) {
  const [period, setPeriod] = useState<HistoryPeriod>('week');
  const [response, setResponse] = useState<StatisticResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const statData = STATS[stat];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const config = PERIOD_CONFIG[period];

        const data = await fetchStatistic(stat, config.days, config.bins);

        setResponse(data);
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [period, stat]);

  const values = response ? Object.values(response.bins) : [0]; // Placeholder for when fetching data fails

  const labels = getChartLabels(period, values.length);

  return (
    <View className="w-full px-2">
      <View>
        <AppText className="text-xl font-bold">{statData.title}</AppText>
        <AppText>Today: {loading ? 'Loading...' : `${response?.today} ${statData.unit}`}</AppText>
      </View>
      <View className="mb-4 flex-row gap-2">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          className="py-0"
          onPress={() => setPeriod('week')}>
          <AppText>Week</AppText>
        </Button>

        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          className="py-0"
          onPress={() => setPeriod('month')}>
          <AppText>Month</AppText>
        </Button>

        <Button
          variant={period === 'year' ? 'default' : 'outline'}
          className="py-0"
          onPress={() => setPeriod('year')}>
          <AppText>Year</AppText>
        </Button>
      </View>

      {!loading && (
        <StatisticChart values={values} labels={labels} barconfig={statData.barconfig} />
      )}

      <View className="mt-4 gap-2">
        <AppText>Highest: {loading ? 'Loading...' : `${response?.high} ${statData.unit}`}</AppText>

        <AppText>Lowest: {loading ? 'Loading...' : `${response?.low} ${statData.unit}`}</AppText>

        <AppText>
          Average: {loading ? 'Loading...' : `${response?.average} ${statData.unit}`}
        </AppText>

        {error && <AppText className="text-red-500">Failed to load statistics: {error}</AppText>}
      </View>
    </View>
  );
}
