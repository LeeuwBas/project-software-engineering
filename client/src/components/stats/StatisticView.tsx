import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { getChartLabels } from '@/lib/stats/chart-labels';
import { HistoryPeriod, PERIOD_CONFIG } from '@/lib/stats/statistics-types';
import { StatisticsSummary } from '@/lib/storage';
import { GoaledModule, ModuleId, MODULES } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { StatisticChart } from './StatisticChart';

export function StatisticView({ stat }: { stat: ModuleId }) {
  console.log('Rendering stat:', stat);

  const [period, setPeriod] = useState<HistoryPeriod>('week');
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [bars, setBars] = useState<number[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const module: GoaledModule = MODULES.find(
    (module): module is GoaledModule => module.id === stat
  )!;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const config = PERIOD_CONFIG[period];

        const now = new Date();
        const past = new Date();
        past.setTime(now.getTime() - 1000 * 60 * 60 * 24 * config.days);
        const barsData = await module.bridge.getBarChart(
          config.bins,
          config.days / config.bins,
          now
        );
        setBars(barsData);
        const summaryData = await module.bridge.getSummary(past, now);
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

  const config = useMemo(() => PERIOD_CONFIG[period], [period]);
  const labels = useMemo(() => getChartLabels(period), [period]);

  const values = useMemo(() => bars ?? new Array<number>(config.bins).fill(0), [bars, config]);

  return (
    <View className="w-full px-2">
      <View>
        <AppText className="text-xl font-bold">{module.name}</AppText>
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

      {!loading && <StatisticChart module={module} values={values} labels={labels} />}

      <View className="mt-4 gap-2">
        <AppText>
          Highest: {loading ? 'Loading...' : `${summary?.maximum} ${module.unit}`}
          {/*Highest: {loading ? 'Loading...' : `${Math.max(...values)} ${statData.unit}`}*/}
        </AppText>

        <AppText>
          <AppText>Lowest: {loading ? 'Loading...' : `${summary?.minimum} ${module.unit}`}</AppText>
          {/*Lowest: {loading ? 'Loading...' : `${Math.min(...values)} ${statData.unit}`}*/}
        </AppText>

        <AppText>
          Average:{' '}
          {loading
            ? 'Loading...'
            : `${Math.round((summary?.average ?? 0) * 10) / 10} ${module.unit}`}
          {/*Average:{' '}*/}
          {/*{loading*/}
          {/*  ? 'Loading...'*/}
          {/*  : `${Math.round((values.reduce((Acc, x) => Acc + x) / values.length) * 10) / 10} ${statData.unit}`}*/}
        </AppText>

        {error && <AppText className="text-red-500">Failed to load statistics: {error}</AppText>}
      </View>
    </View>
  );
}
