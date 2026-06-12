import { AppText } from '@/components/AppText';
import { StatisticChart } from '@/components/stats/StatisticChart';
import { Button } from '@/components/ui/button';
import { getChartLabels } from '@/lib/stats/chart-labels';
import { HistoryPeriod, PERIOD_CONFIG, StatName, STATS } from '@/lib/stats/statistics-types';
import {
  getStatBarChart,
  getStatSummary,
  StatisticsBarChart,
  StatisticsSummary,
} from '@/lib/storage';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

function generateData(bins: number): number[] {
  const values = Array(bins);
  for (let i = 0; i < values.length; i++) {
    values[i] = Math.round(Math.random() * 20 + 50);
  }
  return values;
}

export function StatisticView({ stat }: { stat: StatName }) {
  const [period, setPeriod] = useState<HistoryPeriod>('week');
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [bars, setBars] = useState<StatisticsBarChart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const statData = STATS[stat];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const config = PERIOD_CONFIG[period];

        // Temporary calls to storage.ts functions
        // Use API bridge when it is done
        const now = new Date();
        const past = new Date();
        past.setTime(now.getTime() - 1000 * 60 * 60 * 24 * config.days);
        const barsData = await getStatBarChart('waterDrank', past, now, config.bins);
        setBars(barsData);
        const summaryData = await getStatSummary('waterDrank', config.days);
        setSummary(summaryData);
      } catch (err) {
        console.error(err);

        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [period, stat]);

  // const values = bars ? Object.values(bars.bins) : [0]; // Placeholder for when fetching data fails
  const config = PERIOD_CONFIG[period];
  const values = generateData(config.bins);

  const labels = getChartLabels(period);

  return (
    <View className="w-full px-2">
      <View>
        <AppText className="text-xl font-bold">{statData.title}</AppText>
        {/* <AppText>Today: {loading ? 'Loading...' : `${response?.today} ${statData.unit}`}</AppText> */}
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
        <AppText>
          Highest: {loading ? 'Loading...' : `${summary?.maximum} ${statData.unit}`}
        </AppText>

        <AppText>Lowest: {loading ? 'Loading...' : `${summary?.minimum} ${statData.unit}`}</AppText>

        <AppText>
          Average: {loading ? 'Loading...' : `${summary?.average} ${statData.unit}`}
        </AppText>

        {error && <AppText className="text-red-500">Failed to load statistics: {error}</AppText>}
      </View>
    </View>
  );
}
