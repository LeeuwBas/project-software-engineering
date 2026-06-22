import { StatisticView } from '@/components/stats/StatisticView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CalendarOverview from '@/components/widgets/CalendarOverview';
import { useAppContext } from '@/lib/AppContext';
import { Tab, TabId } from '@/lib/stats/statistics-types';
import Calender from '@assets/icons/module_icons/calendar.svg';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

/** TODO (ZJWeng): docstring and comments throughout */
export default function Stats({}: {}) {
  const { statsOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabId>('calender');
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  useEffect(() => {
    if (!statsOpen) {
      setActiveTab('calender');
    }
  }, [statsOpen]);

  if (!statsOpen) {
    return null;
  }

  const labels: Tab[] = [
    { id: 'calender', icon: Calender },
    { id: 'water', icon: Glass },
    { id: 'steps', icon: Shoe },
  ];

  return (
    <View
      className={`absolute -top-8 h-[35rem] w-full items-center transition-opacity duration-200 ${statsOpen ? 'opacity-100' : 'opacity-0'}`}>
      <View className="bottom-full w-[90%] items-center">
        <View className="absolute -top-10 w-full flex-row gap-1">
          {labels.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant={id === activeTab ? 'default' : 'outline'}
              className={id === activeTab ? '' : 'border-0 px-5 opacity-60'}
              onPress={() => setActiveTab(id)}>
              <Icon width={30} height={30} color={iconColor} />
            </Button>
          ))}
        </View>
        <Card className="w-full items-center justify-center py-3 shadow-block">
          <CardContent className="w-full items-center px-2">
            {activeTab === 'calender' ? <CalendarOverview /> : <StatisticView stat={activeTab} />}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
