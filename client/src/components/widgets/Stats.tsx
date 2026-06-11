import { Card, CardContent } from '@/components/ui/card';
import { View } from 'react-native';
import { AppText } from '../AppText';
import CalendarOverview from './CalendarOverview';

export default function Stats({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) {
    return null;
  }
  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="pt-3 mb-3 h-auto w-[90%] items-center justify-center shadow-block">
          <CardContent className="px-2 w-full items-center">
            <CalendarOverview></CalendarOverview>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
