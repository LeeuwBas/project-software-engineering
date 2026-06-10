import {Button} from '@/components/ui/button';
import {GlassWater, Minus, Plus} from 'lucide-react-native';
import {View} from 'react-native';
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
            <View className='flex flex-row items-center w-full p-2 justify-between'>
                <View className='flex flex-row items-center gap-2'>
                    <GlassWater size={30}/>
                    <AppText className='text-base font-bold min-w-10'>
                        {water}
                    </AppText>
                </View>

                <View className='flex flex-row items-center gap-2'>
                    <Button className="bg-white active:bg-slate-200" onPress={() => alterWaterValue(10)}>
                        <Plus size={35} color={"#1F51FF"}/>
                    </Button>
                    <Button className='bg-white active:bg-slate-200' onPress={() => alterWaterValue(-10)}>
                        <Minus size={35} color={"#FF0000"}/>
                    </Button>
                </View>
            </View>
        </>
    );
}
