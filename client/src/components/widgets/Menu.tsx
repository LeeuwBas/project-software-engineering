import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';
import StepsWidget from './StepsWidget';
import WaterWidget from './WaterWidget';

export default function Menu({ water, setWater }: { water: number; setWater: Function }) {
  // TODO: Add backend for retrieving name
  const name = 'Alex';
  const { menuOpen } = useAppContext();
  if (!menuOpen) {
    return null;
  }

  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <AttachStep index={2} style={{ alignSelf: 'center' }}>
          <Card className="mb-6 h-auto w-72 items-center justify-center shadow-block">
            <CardHeader className="items-center">
              <CardTitle className="mx-6 my-4 text-2xl font-bold">{name}</CardTitle>
            </CardHeader>
            <CardContent className="w-full max-w-full items-center">
              <WaterWidget water={water} setWater={setWater} />
              <StepsWidget />
            </CardContent>
          </Card>
        </AttachStep>
      </View>
    </View>
  );
}
