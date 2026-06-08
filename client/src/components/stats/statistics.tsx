import { View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { Accordion } from '@/components/ui/accordion';
import { StatisticCard } from '@/components/stats/statistic-card';
import { STATISTICS } from '@/components/stats/statistics-metadata';
import { ScrollView } from 'react-native';

/**
The parent function of the statistics page builder,
thus also owns the Reusables Accordion element.
Maps all modules defined in STATISTICS to their own separate
card widget.

@return {TSX.element} The page frame holding all other widgets
*/
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
