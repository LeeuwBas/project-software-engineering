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
      className={`absolute -top-20 w-full items-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <View className="absolute bottom-full w-[90%] items-center">
        <View className="w-full flex-row justify-items-start">
          {labels.map(({ id, icon: Icon }) => (
            <Button
              key={id}
              variant={id === activeTab ? 'default' : 'outline'}
              className=""
              onPress={() => setActiveTab(id)}>
              <Icon width={30} height={30} />
            </Button>
          ))}
        </View>
        <Card className="w-full items-center justify-center pt-3 shadow-block">
          <CardContent className="w-full items-center px-2">
            <CalendarOverview></CalendarOverview>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
