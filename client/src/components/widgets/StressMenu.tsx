import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/lib/AppContext';
import { View, Text } from 'react-native';
import StressButtons from './StressButtons';

export default function StressMenu() {
  const { stressMenuOpen } = useAppContext();
  
  const [score1, setScore1] = useState<number | null>(null);
  const [score2, setScore2] = useState<number | null>(null);
  const [score3, setScore3] = useState<number | null>(null);

  if (!stressMenuOpen) {
    return null;
  }

  return (
    <View className="absolute -top-6 w-full items-center">
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="items-center">
            <CardTitle className="mx-6 mt-4 text-2xl font-bold">Today I felt...</CardTitle>
          </CardHeader>
          <CardContent className="w-full max-w-full">
            <Text className='text-left'>...nervous and stressed:</Text>
            <StressButtons value={score1} onChange={setScore1} />
          </CardContent>
          <CardContent className="w-full max-w-full">
            <Text className='text-left'>...I could not cope with all the things I had to do:</Text>
            <StressButtons value={score2} onChange={setScore2} />
          </CardContent>
          <CardContent className="w-full max-w-full">
            <Text className='text-left'>...difficulties were piling up so high that I could not overcome them:</Text>
            <StressButtons value={score3} onChange={setScore3} />
          </CardContent>
        </Card>
      </View>
    </View>
  );
}