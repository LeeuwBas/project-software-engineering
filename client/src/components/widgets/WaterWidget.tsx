import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';
import { GlassWater, Plus, Minus } from 'lucide-react-native';

export default function WaterWidget(
    {
        water,
        setWater
    }: {
        water: number,
        setWater: (value: number) => void
    }) {

    function alterWaterValue(value: number) {
        if (water+value <= 100 && water+value >= 0) {
            setWater(water+value);
        }
    }

    return (
        <>
            <View className='flex flex-row items-center w-full p-2 justify-between'>
                <View className='flex flex-row items-center gap-2'>
                    <GlassWater size={30}/>
                    <Text className='min-w-10'>
                        {water}
                    </Text>
                </View>

                <View className='flex flex-row items-center gap-2'>
                    <Button className="bg-white" size="icon" onPress={() => alterWaterValue(1)}>
                        <Plus size={35} color={"#1F51FF"}/>
                    </Button>
                    <Button className='bg-white' onPress={() => alterWaterValue(-1)}>
                        <Minus size={35} color={"#FF0000"}/>
                    </Button>
                </View>
            </View>
        </>
    );
}
