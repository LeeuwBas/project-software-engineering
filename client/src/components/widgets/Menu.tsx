import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StepsWidget from '@/components/widgets/StepsWidget';
import WaterWidget from '@/components/widgets/WaterWidget';
import { useAppContext } from '@/lib/AppContext';
import { useState } from 'react';
import { View } from 'react-native';
import GoalsView from './GoalsView';

export default function Menu({ water, setWater }: { water: number; setWater: Function }) {
  const [goalsViewActive, setGoalsViewActive] = useState(false);
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
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="w-full flex-1 flex-row items-center justify-between">
            <CardTitle className="mx-2 my-4 text-2xl font-bold">{name}</CardTitle>
            {goalsViewActive ? (
              <Button
                onPress={() => setGoalsViewActive(!goalsViewActive)}
                className="py-0"
                variant="secondary">
                <AppText className="font-bold text-white">Confirm</AppText>
              </Button>
            ) : (
              <Button onPress={() => setGoalsViewActive(!goalsViewActive)} className="py-0">
                <AppText className="font-bold text-white">Change goals</AppText>
              </Button>
            )}
          </CardHeader>
          <CardContent className="w-full max-w-full items-start">
            {goalsViewActive ? (
              <GoalsView />
            ) : (
              <>
                <WaterWidget water={water} setWater={setWater} />
                <StepsWidget />
              </>
            )}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
