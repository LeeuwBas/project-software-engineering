import { StatisticChart } from '@/components/stats/statistic-chart';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppText } from '@/components/AppText';
import { getChartLabels } from '@/lib/stats/chart-labels';
import { fetchStatistic } from '@/lib/stats/statistics-api';
import {
  HistoryPeriod,
  PERIOD_CONFIG,
  StatisticMetadata,
  StatisticResponse,
} from '@/lib/stats/statistics-types';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

interface StatisticCardProps {
  metadata: StatisticMetadata;
}

/**
Builds the statistics card for a single module.
Displays the module name and today's stats by default.
If extended, displays stats in barchart and summary based
on history period consisting of (and accessible by buttons):
- week
- month
- year

This function is also responsible for API/storage call using the
metadata parameter.
@param {StatisticCardProps} metadata - required metadata for a module
@return {TSX.element} the card of a built module
*/
export function StatisticCard({
  metadata,
}: StatisticCardProps) {
  const [period, setPeriod] =
    useState<HistoryPeriod>('week');

  const [response, setResponse] =
    useState<StatisticResponse | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const config =
          PERIOD_CONFIG[period];

        const data =
          await fetchStatistic(
            metadata.id,
            config.days,
            config.bins,
          );

        setResponse(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : 'Unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [period]);

  const values = response
    ? Object.values(response.bins)
    : [0];  // Placeholder for when fetching data fails

  const labels = getChartLabels(
    period,
    values.length,
  );

  return (
    <AccordionItem value={metadata.id}>
      <Card>
        <CardHeader>
          <AccordionTrigger>
            <View>
              <CardTitle>
                {metadata.title}
              </CardTitle>

              <CardDescription>
                Today:{' '}
                {loading
                  ? 'Loading...'
                  : `${response?.today} ${metadata.unit}`
                }
              </CardDescription>
            </View>
          </AccordionTrigger>
        </CardHeader>

        <AccordionContent>
          <CardContent>
            <View className="mb-4 flex-row gap-2">
              <Button
                variant={
                  period === 'week'
                    ? 'default'
                    : 'outline'
                }
                onPress={() =>
                  setPeriod('week')
                }
              >
                <AppText>Week</AppText>
              </Button>

              <Button
                variant={
                  period === 'month'
                    ? 'default'
                    : 'outline'
                }
                onPress={() =>
                  setPeriod('month')
                }
              >
                <AppText>Month</AppText>
              </Button>

              <Button
                variant={
                  period === 'year'
                    ? 'default'
                    : 'outline'
                }
                onPress={() =>
                  setPeriod('year')
                }
              >
                <AppText>Year</AppText>
              </Button>
            </View>

            <StatisticChart
              values={values}
              labels={labels}
            />

            <View className="mt-4 gap-2">
              <AppText>
                Highest:{' '}
                {loading
                  ? 'Loading...'
                  : `${response?.high} ${metadata.unit}`
                }
              </AppText>

              <AppText>
                Lowest:{' '}
                {loading
                  ? 'Loading...'
                  : `${response?.low} ${metadata.unit}`
                }
              </AppText>

              <AppText>
                Average:{' '}
                {loading
                  ? 'Loading...'
                  : `${response?.average} ${metadata.unit}`
                }
              </AppText>

              {error && (
                <AppText className="text-red-500">
                  Failed to load statistics: {error}
                </AppText>
              )}
            </View>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
