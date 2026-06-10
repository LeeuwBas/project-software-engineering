import {Button} from '@/components/ui/button';
import {GlassWater, Minus, Plus} from 'lucide-react-native';
import {Text, View} from 'react-native';
import {AppText} from '../AppText';
import {waterBridge} from "@/lib/api/APIBridge";
import {useWater} from "@/lib/api/WaterBridge";

export default function WaterWidget() {

    const water = useWater() ?? 0;

    async function alterWaterValue(value: number) {
        await waterBridge.addWater(value);
    }

  return (
    <>
      <View className="flex w-full flex-row items-center justify-between p-2">
        <View className="flex flex-row items-center gap-2">
          <GlassWater size={30} />
          <AppText className="min-w-10 text-base font-bold">{water}</AppText>
        </View>

        <View className="flex flex-row items-center gap-2">
          <Button variant={'outline'} onPress={() => alterWaterValue(10)}>
            <Plus size={35} />
          </Button>
          <Button variant="outline" onPress={() => alterWaterValue(-10)}>
            <Minus size={35} />
          </Button>
        </View>
      </View>
    </>
  );
}
