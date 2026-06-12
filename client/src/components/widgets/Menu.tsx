import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { View } from 'react-native';
import StepsWidget from './StepsWidget';
import WaterWidget from './WaterWidget';

export default function Menu({ isOpen }: { isOpen: boolean }) {
  // TODO: Add backend for retrieving name
  const name = 'Alex';

  if (!isOpen) {
    return null;
  }

  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="items-center">
            <CardTitle className="mx-6 my-4 text-2xl font-bold">{name}</CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-full items-center">
            <WaterWidget />
            <StepsWidget />
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
