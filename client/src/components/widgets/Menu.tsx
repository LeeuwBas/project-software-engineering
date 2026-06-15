import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { View, TextInput } from 'react-native';
import { AppText } from '../AppText';
import StepsWidget from './StepsWidget';
import WaterWidget from './WaterWidget';
import { GlassWater } from 'lucide-react-native';
import { useState } from 'react';
import { getCurrentGoal } from '@/lib/storage';

export default function Menu({ water, setWater }: { water: number; setWater: Function }) {
  const [goalsViewActive, setGoalsViewActive] = useState(false)
  // TODO: Add backend for retrieving name
  const name = 'Alex';
  const { menuOpen } = useAppContext();
  if (!menuOpen) {
    return null;
  }

  const goals = {'water': 10, 'steps': 10000, 'eten': 5}

  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="w-full flex-1 flex-row items-center justify-between">
            <CardTitle className="mx-2 my-4 text-2xl font-bold">{name}</CardTitle>
            <Button onPress={() => setGoalsViewActive(!goalsViewActive)} className="py-0">
              <AppText className="font-bold text-white">Change goals</AppText>
            </Button>
          </CardHeader>
          {/* Normal view */}
          {!goalsViewActive && (
            <CardContent className="w-full max-w-full items-center">
              <WaterWidget water={water} setWater={setWater} />
              <StepsWidget />
            </CardContent>
          )}
          {/* Goals view */}
          {goalsViewActive && (
            <CardContent className="w-full max-w-full items-start">
              <AppText className='font-bold text-lg'>Goals:</AppText>
              <View className="flex flex-row items-center gap-2 p-2">
                <GlassWater size={30} />
                <TextInput className='bg-slate-400' defaultValue={`${goals['water']}`}></TextInput>
              </View>
            </CardContent>
          )}
        </Card>
      </View>
    </View>
  );
}
