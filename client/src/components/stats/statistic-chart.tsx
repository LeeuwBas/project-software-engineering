import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { StatisticHistoryPoint } from './statistics-types';

interface StatisticChartProps {
  data: StatisticHistoryPoint[];
}

const screenWidth = Dimensions.get('window').width;

export function StatisticChart({
  data,
}: StatisticChartProps) {
  return (
    <BarChart
      data={{
        labels: data.map(point => point.day),
        datasets: [
          {
            data: data.map(point => point.value),
          },
        ],
      }}
      width={screenWidth - 64}
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
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
  );
}