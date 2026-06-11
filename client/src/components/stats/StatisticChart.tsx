import { barConfig } from '@/lib/stats/statistics-types';
import { useState } from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface StatisticChartProps {
  values: number[];
  labels: string[];
  barconfig: barConfig;
}

export function StatisticChart({ values, labels, barconfig }: StatisticChartProps) {
  const data = values.map((value, index) => ({ value: value, label: labels[index] }));
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
        frontColor={barconfig.color}
        maxValue={barconfig.maxValue}
        spacing={2}
        initialSpacing={0}
        adjustToWidth={true}
        showValuesAsTopLabel={true}
        topLabelTextStyle={{ fontFamily: 'IosevkaCharon', fontSize: topLabelSize }}
      />
    </View>
  );
}
