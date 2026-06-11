import { Card, CardContent } from '@/components/ui/card';
import PersonIcon from '@assets/icons/person.svg';
import { CalendarDays, GlassWater, LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Button } from '../ui/button';
import CalendarOverview from './CalendarOverview';

type Tab = {
  id: string;
  icon: LucideIcon | React.FC<SvgProps>;
};

export default function Stats({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) {
    return null;
  }

  const [activeTab, setActiveTab] = useState('calender');

  const labels: Tab[] = [
    { id: 'calender', icon: CalendarDays },
    { id: 'water', icon: GlassWater },
    { id: 'acc', icon: PersonIcon },
  ];

  return (
    <View
      className={`absolute -top-8 h-[35rem] w-full items-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <View className="bottom-full w-[90%] items-center">
        <View className="absolute -top-10 w-full flex-row gap-1">
          {labels.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant={id === activeTab ? 'default' : 'outline'}
              className={id === activeTab ? '' : 'border-0 px-5 opacity-60'}
              onPress={() => setActiveTab(id)}>
              <Icon width={30} height={30} />
            </Button>
          ))}
        </View>
        <Card className="w-full items-center justify-center py-3 shadow-block">
          <CardContent className="w-full items-center px-2">
            {activeTab === 'calender' ? <CalendarOverview /> : <></>}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
