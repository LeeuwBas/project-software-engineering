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

export function StatisticChart({ module, values, labels }: StatisticChartProps) {
  const { colorScheme } = useColorScheme();
  const labelColor = colorScheme === 'dark' ? 'white' : '#555555';
  const [width, setWidth] = useState(0);

  const goal = module.bridge.useGoal() ?? 0;

  const data = values.map((value, index) => ({
    value: value,
    label: labels[index],
    topLabelComponent: () => <AppText style={{ color: labelColor }}>{value}</AppText>,
  }));
  const barWidth = width / values.length;
  const topLabelSize = Math.max(10, Math.min(16, barWidth * 0.2));

  return (
    <View className="w-full" onLayout={(e) => setWidth(e.nativeEvent.layout.width * 1.5)}>
      <BarChart
        data={data}
        parentWidth={width}
        yAxisThickness={0}
        xAxisThickness={0}
        frontColor={module.color}
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
      />
    </View>
  );
}
