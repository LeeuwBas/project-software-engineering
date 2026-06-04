import {
  Accordion,
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
import { Text } from '@/components/ui/text';
import { StatisticData } from '@/components/stats/statistics-types';
import { View } from 'react-native';

interface StatisticCardProps {
  stat: StatisticData;
}

export function StatisticCard({ stat }: StatisticCardProps) {
  const values = stat.history.map(d => d.value);

  const highest = Math.max(...values);
  const lowest = Math.min(...values);

  const average =
    values.reduce((sum, value) => sum + value, 0) /
    values.length;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={stat.id}>
        <Card>
          <CardHeader>
            <AccordionTrigger>
              <View>
                <CardTitle>{stat.title}</CardTitle>
                <CardDescription>
                  Today: {stat.current} {stat.unit}
                </CardDescription>
              </View>
            </AccordionTrigger>
          </CardHeader>

          <AccordionContent>
            <CardContent>
              <View className="mt-4 gap-2">
                <Text>Highest: {highest} {stat.unit}</Text>
                <Text>Lowest: {lowest} {stat.unit}</Text>
                <Text>Average: {average.toFixed(1)} {stat.unit}</Text>
              </View>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
