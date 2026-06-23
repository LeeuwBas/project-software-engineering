import { GoaledModule } from '@/lib/types';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { AppText } from '../AppText';

interface StatisticChartProps {
  module: GoaledModule;
  values: number[];
  labels: string[];
}

/** TODO (AlexAugustijn): docstring, and some comments explaining each section */
export function StatisticChart({ module, values, labels }: StatisticChartProps) {
  const { colorScheme } = useColorScheme();
  const labelColor = colorScheme === 'dark' ? 'white' : '#555555';
  const [width, setWidth] = useState(0);

  const goal = module.bridge.useGoal() ?? 0;

  const data = values.map((value, index) => ({
    value: Math.round(value * 10) / 10,
    label: labels[index],
    topLabelComponent: () => <AppText style={{ color: labelColor }}>{value}</AppText>,
  }));
  const barWidth = width / values.length;
  const topLabelSize = Math.max(10, Math.min(16, barWidth * 0.2));

  const getChartMax = (goal: number) => {
    const magnitude = Math.pow(10, String(goal).length - 1);
    const rounded = Math.ceil(goal / magnitude) * magnitude;

    return rounded === goal ? goal + magnitude : rounded;
  };

  const maxValue = getChartMax(goal);

  return (
    <View className="w-full" onLayout={(e) => setWidth(e.nativeEvent.layout.width * 1.5)}>
      <BarChart
        data={data}
        parentWidth={width}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisLabelWidth={String(maxValue).length * 10}
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
