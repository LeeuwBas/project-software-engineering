import { AppText } from '@/components/AppText';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StressButtons from '@/components/widgets/StressButtons';
import { stressBridge } from '@/lib/api/APIBridge';
import { useAppContext } from '@/lib/AppContext';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

async function saveStress(score1: number, score2: number, score3: number) {
  const score = score1 + score2 + score3;
  let level = 0;

  if (score < 8) {
    level = 0;
  } else if (score < 12) {
    level = 1;
  } else {
    level = 2;
  }

  await stressBridge.set(level);
}

/** Content for the stress input questionnaire.
 * 
 * @returns JSX element
*/
export default function StressMenu() {
  const { stressMenuOpen, setSendStress } = useAppContext();

  const [score1, setScore1] = useState<number | null>(null);
  const [score2, setScore2] = useState<number | null>(null);
  const [score3, setScore3] = useState<number | null>(null);

  useEffect(() => {
    setSendStress(() => async () => {
      if (score1 !== null && score2 !== null && score3 !== null) {
        await saveStress(score1, score2, score3);
      }
    });

    return () => setSendStress(() => {});
  }, [score1, score2, score3, setSendStress]);

  if (!stressMenuOpen) {
    return null;
  }

  // Every cardcontent is for every question with matching AppText and buttons.
  return (
    <View className="absolute -top-6 w-full items-center">
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="items-center">
            <AppText className="mx-6 mt-4 text-2xl font-bold">Today I felt...</AppText>
          </CardHeader>
          <CardContent className="w-full max-w-full">
            <AppText className="text-left">...nervous and stressed:</AppText>
            <StressButtons value={score1} onChange={setScore1} />
          </CardContent>
          <CardContent className="w-full max-w-full">
            <AppText className="text-left">
              ...I could not cope with all the things I had to do:
            </AppText>
            <StressButtons value={score2} onChange={setScore2} />
          </CardContent>
          <CardContent className="w-full max-w-full">
            <AppText className="text-left">
              ...difficulties were piling up so high that I could not overcome them:
            </AppText>
            <StressButtons value={score3} onChange={setScore3} />
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
