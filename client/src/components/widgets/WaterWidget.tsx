import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';

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
            <View className='flex flex-row items-center w-3/5 p-4 gap-2'>
                <Text className='min-w-10 flex-1'>
                    {water}
                </Text>
                <Button className="bg-white" size="icon" onPress={() => alterWaterValue(10)}>
                    <Text className="text-blue-500 font-bold">
                    +
                    </Text>
                </Button>
                <Button className='bg-white' onPress={() => alterWaterValue(-10)}>
                    <Text className='text-red-600'>
                    -
                    </Text>
                </Button>

            </View>
        </>
    );
}
