import { Button } from '@/components/ui/button';
import { GlassWater, Minus, Plus } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { AppText } from '../AppText';
export default function WaterWidget(
    {
        water,
        setWater
    }: {
        water: number,
        setWater: {(value: number): void}
    }) {

    function alterWaterValue(value: number) {
        const new_water = Math.max(Math.min(water+value, 100), 0);
        setWater(new_water);
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
