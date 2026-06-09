import { StatisticCard } from '@/components/stats/statistic-card';
import { Accordion } from '@/components/ui/accordion';
import { STATISTICS } from '@/lib/stats/statistics-metadata';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Suspense} from 'react';
import { AppText } from '@/components/AppText'

/**
The parent function of the statistics page builder,
thus also owns the Reusables Accordion element.
Maps all modules defined in STATISTICS to their own separate
card widget.

@return {TSX.element} The page frame holding all other widgets
*/
export default function Statistics() {
  return (
    <SafeAreaView className="h-full px-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Accordion
          type="single"
          collapsible
        >
          <Suspense fallback= {
                <AppText> Building page... </AppText>
              }
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
          </Suspense>
        </Accordion>
      </ScrollView>
    </SafeAreaView>
  );
}

