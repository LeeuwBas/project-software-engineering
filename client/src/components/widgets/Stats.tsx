import { Card, CardContent } from '@/components/ui/card';
import { View } from 'react-native';
import { AppText } from '../AppText';

export default function Stats({ isOpen }: { isOpen: boolean }) {
  if (!isOpen) {
    return null;
  }
  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardContent className="w-full items-center">
            <AppText>Test</AppText>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
