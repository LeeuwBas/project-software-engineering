import { Button } from '@/components/ui/button';
import { GlassWater, Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText } from '../AppText';

export default function WaterWidget({ water, setWater }: { water: number; setWater: Function }) {
  function alterWaterValue(value: number) {
    const new_water = Math.max(Math.min(water + value, 100), 0);
    setWater(new_water);
  }

  return (
     <>
      <View className="flex w-full flex-row items-center justify-between p-2">
        <View className="flex flex-row items-center gap-2">
          <GlassWater size={30} />
          <AppText className="min-w-10 text-base font-bold">{water}</AppText>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Button variant={'outline'} disabled={water === 8} onPress={() => alterWaterValue(1)}>
            <Plus size={20} />
          </Button>
          <Button variant="outline" disabled={water === 0} onPress={() => alterWaterValue(-1)}>
            <Minus size={20} />
          </Button>
        </View>
      </View>
    </>
  );
}
