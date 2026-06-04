import { Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface StatisticChartProps {
  values: number[];
  labels: string[];
  unit: string;
}

const screenWidth = Dimensions.get('window').width;

export function StatisticChart({
  values,
  labels,
  unit
}: StatisticChartProps) {
  const chartWidth = Math.max(
    screenWidth,
    values.length * 80,
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
    >
      <BarChart
        data={{
          labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix={` ${unit}`}
        chartConfig={{
          decimalPlaces: 1,
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) =>
            `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) =>
            `rgba(0, 0, 0, ${opacity})`,
        }}
        fromZero
        showValuesOnTopOfBars
      />
    </ScrollView>
  );
}