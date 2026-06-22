import { barConfig } from '@/lib/stats/statistics-types';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { AppText } from '../AppText';

interface StatisticChartProps {
  values: number[];
  labels: string[];
  barconfig: barConfig;
  goal: number;
  maxValue: number;
}

/** TODO (AlexAugustijn): docstring, and some comments explaining each section */
export function StatisticChart({ values, labels, barconfig, goal, maxValue }: StatisticChartProps) {
  const { colorScheme } = useColorScheme();
  const labelColor = colorScheme === 'dark' ? 'white' : '#555555';

  const data = values.map((value, index) => ({
    value: Math.round(value * 10) / 10,
    label: labels[index],
    topLabelComponent: () => <AppText style={{ color: labelColor }}>{value}</AppText>,
  }));
  const [width, setWidth] = useState(0);
  const barWidth = width / values.length;
  const topLabelSize = Math.max(10, Math.min(16, barWidth * 0.2));

  return (
    <View className="w-full" onLayout={(e) => setWidth(e.nativeEvent.layout.width * 1.5)}>
      <BarChart
        data={data}
        parentWidth={width}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={String(maxValue).length * 10}
        frontColor={barconfig.barcolor}
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
          color: barconfig.goalcolor,
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
