import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import Glass from '@assets/icons/module_icons/glass.svg';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

export default function WaterWidget({ water, setWater }: { water: number; setWater: Function }) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  // TODO: get goal from API
  const goal = 10;

  function alterWaterValue(value: number) {
    const new_water = Math.max(Math.min(water + value, goal), 0);
    setWater(new_water);
  }

  return (
    <>
      <View className="flex w-full flex-row items-center justify-between p-2">
        <View className="flex flex-row items-center gap-2">
          <Glass height={30} width={30} />
          <AppText className="min-w-10 text-base font-bold">
            {water} / {goal}
          </AppText>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Button variant={'outline'} disabled={water === goal} onPress={() => alterWaterValue(1)}>
            <Plus size={20} color={iconColor} />
          </Button>
          <Button variant="outline" disabled={water === 0} onPress={() => alterWaterValue(-1)}>
            <Minus size={20} color={iconColor} />
          </Button>
        </View>
      </View>
    </>
  );
}
