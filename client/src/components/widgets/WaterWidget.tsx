import { Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card } from '../ui/card';


const WaterWidget = ({ startValue }: { startValue: number}) => {
    const [water, setWater] = useState(startValue)

    function alterWaterValue(value: number) {
    if (water+value <= 100 && water+value >= 0) {
        setWater(water+value);
    }
    }

    function resetWater() {
        setWater(0);
    }


    return (
        <>
            <Card className='flex flex-row items-center w-3/5 p-4 gap-2'>
                <Text className='min-w-10 flex-1'>
                    {water}
                </Text>
                <Button className="bg-white" variant="outline" size="icon" onPress={() => alterWaterValue(10)}>
                    <Text className="text-blue-500 font-bold">
                    +
                    </Text>
                </Button>
                <Button variant='outline' onPress={() => alterWaterValue(-10)}>
                    <Text className='text-red-600'>
                    -
                    </Text>
                </Button>

            </Card>
        </>
    );
}

export default WaterWidget;