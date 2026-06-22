import { StatisticView } from '@/components/stats/StatisticView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CalendarOverview from '@/components/widgets/CalendarOverview';
import { useAppContext } from '@/lib/AppContext';
import { getActiveModules } from '@/lib/settings';
import { GoaledModule, ModuleId, MODULES } from '@/lib/types';
import Calender from '@assets/icons/module_icons/calendar.svg';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

type TabId = ModuleId | 'calendar';
interface TabLabel {
  id: TabId;
  icon: React.FC<SvgProps>;
}

export default function Stats({}: {}) {
  const { statsOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabId>('calendar');
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const activeGoaledModules = MODULES.filter(
    (module): module is GoaledModule => getActiveModules()[module.id] && 'goalConfig' in module
  );

  useEffect(() => {
    if (!statsOpen) {
      setActiveTab('calendar');
    }
  }, [statsOpen]);

  // if (!statsOpen) {
  //   return null;
  // }

  const labels: TabLabel[] = [
    {
      id: 'calendar',
      icon: Calender,
    },
    ...activeGoaledModules.map((module) => ({
      id: module.id,
      icon: module.icon,
    })),
  ];

  return (
    <View
      pointerEvents={statsOpen ? 'auto' : 'none'}
      className={`absolute -top-8 h-[35rem] w-full items-center transition-opacity duration-200 ${statsOpen ? 'opacity-100' : 'opacity-0'}`}>
      <View className="bottom-full w-[90%] items-center">
        <View className="absolute -top-12 w-full flex-row gap-1">
          {labels.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant={id === activeTab ? 'default' : 'outline'}
              className={`${id === activeTab ? '' : 'border-0 px-5 opacity-60'} `}
              onPress={() => setActiveTab(id)}>
              <Icon width={30} height={30} color={iconColor} />
            </Button>
          ))}
        </View>
        <Card className="w-full items-center justify-center py-3 shadow-block">
          <CardContent className="w-full items-center px-2">
            {activeTab === 'calendar' ? (statsOpen ? <CalendarOverview /> : null) : <StatisticView stat={activeTab} />}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
