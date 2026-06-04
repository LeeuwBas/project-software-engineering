import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { StatisticChart } from '@/components/stats/statistic-chart';
import {
  HistoryPeriod,
  PERIOD_CONFIG,
  StatisticMetadata,
  StatisticResponse,
} from '@/components/stats/statistics-types';
import { getChartLabels } from '@/components/stats/chart-labels';
import { fetchStatistic } from '@/components/stats/statistics-api';

interface StatisticCardProps {
  metadata: StatisticMetadata;
}

export function StatisticCard({
  metadata,
}: StatisticCardProps) {
  const [period, setPeriod] =
    useState<HistoryPeriod>('week');

  const [response, setResponse] =
    useState<StatisticResponse | null>(null);

  useEffect(() => {
    async function load() {
      const config =
        PERIOD_CONFIG[period];

      const data =
        await fetchStatistic(
          metadata.id,
          config.days,
          config.bins,
        );

      setResponse(data);
    }

    load();
  }, [metadata.id, period]);

  if (!response) {
    return (
      <AccordionItem value={metadata.id}>
        <Card>
          <CardContent>
            <Text>Loading...</Text>
          </CardContent>
        </Card>
      </AccordionItem>
    );
  }

  const values =
    Object.values(response.bins);

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
                Today: {response.today}{' '}
                {metadata.unit}
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
                <Text>Week</Text>
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
                <Text>Month</Text>
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
                <Text>Year</Text>
              </Button>
            </View>

            <StatisticChart
              values={values}
              labels={labels}
            />

            <View className="mt-4 gap-2">
              <Text>
                Highest: {response.high}{' '}
                {metadata.unit}
              </Text>

              <Text>
                Lowest: {response.low}{' '}
                {metadata.unit}
              </Text>

              <Text>
                Average: {response.average}{' '}
                {metadata.unit}
              </Text>
            </View>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
}
