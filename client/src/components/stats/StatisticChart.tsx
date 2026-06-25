import { AppText } from '@/components/AppText';
import { GoaledModule } from '@/lib/types';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface StatisticChartProps {
  module: GoaledModule;
  values: number[];
  labels: string[];
}

/**
 * Bar chart component
 *
 * @param module module of the bar chart
 * @param values values of each bar
 * @param labels labels for each bar
 */
export function StatisticChart({ module, values, labels }: StatisticChartProps) {
  const { colorScheme } = useColorScheme();
  const labelColor = colorScheme === 'dark' ? 'white' : '#555555';
  const [width, setWidth] = useState(0);

  const goal = module.bridge.useGoal() ?? 0;

  // Array of bar items
  const data = values.map((value, index) => ({
    value: Math.round(value * 10) / 10,
    label: labels[index],
    topLabelComponent: () => <AppText style={{ color: labelColor }}>{value}</AppText>,
  }));

  // Use width of component to set the width of each bar
  const barWidth = width / values.length;
  const topLabelSize = Math.max(10, Math.min(16, barWidth * 0.2));

  // Set the max value to be used in the bar chart based on the goal or highest value
  function getChartMax(values: number[], goal: number) {
    const highest_value = Math.max(...values, goal);
    const magnitude = Math.pow(10, String(highest_value).length - 1);
    const rounded = Math.ceil(highest_value / magnitude) * magnitude;

    return rounded === highest_value ? highest_value + magnitude : rounded;
  }
  const maxValue = getChartMax(values, goal);

  return (
    <View className="w-full" onLayout={(e) => setWidth(e.nativeEvent.layout.width * 1.5)}>
      <BarChart
        data={data}
        parentWidth={width}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={String(maxValue).length * 10} // Responsive label width
        frontColor={module.color}
        maxValue={maxValue}
        spacing={2}
        initialSpacing={0}
        adjustToWidth={true}
        showValuesAsTopLabel={true}
        topLabelTextStyle={{
          fontFamily: 'IosevkaCharon',
          fontSize: topLabelSize,
          color: labelColor,
        }}
        xAxisLabelTextStyle={{ color: labelColor }}
        yAxisTextStyle={{ color: labelColor }}
        showReferenceLine1={true}
        referenceLine1Position={goal}
        referenceLine1Config={{
          color: module.borderColor,
          type: 'solid',
          thickness: 4,
          zIndex: 1,
        }}
        disablePress={true}
        noOfSections={maxValue / Math.pow(10, String(maxValue).length - 1)}
      />
    </View>
  );
}
