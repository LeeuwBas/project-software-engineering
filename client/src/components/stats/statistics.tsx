import { View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { Accordion } from '@/components/ui/accordion';
import { StatisticCard } from '@/components/stats/statistic-card';
import { STATISTICS } from '@/components/stats/statistics-metadata';
import { ScrollView } from 'react-native';

export function Statistics() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full px-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <Accordion
            type="single"
            collapsible
          >
            {STATISTICS.map(stat => (
              <View
                key={stat.id}
                className="mb-4"
              >
                <StatisticCard
                  metadata={stat}
                />
              </View>
            ))}
          </Accordion>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
