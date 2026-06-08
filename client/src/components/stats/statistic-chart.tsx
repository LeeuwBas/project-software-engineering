import { Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface StatisticChartProps {
  values: number[];
  labels: string[];
}

const screenWidth = Dimensions.get('window').width;

/**
Builds a barchart based on the values and labels given.
Each bar in the chart represents a bin which consists of a
certain amount of days.

@param {number[]} values - datapoint values per bin
@param {string[]} labels - labels for each bin
@return {TSX.element} barchart element
*/
export function StatisticChart({
  values,
  labels
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
        withHorizontalLabels={false}
      />
    </ScrollView>
  );
}
