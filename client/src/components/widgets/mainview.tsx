import Statbar from '@/components/widgets/Statbar';
import Tamagotchi from '@/components/widgets/Tamagotchi';
import { View } from 'react-native';

export default function Main(
    {
        leftSideStat,
        leftSideValue,
        rightSideStat,
        rightSideValue
    }: {
        leftSideStat: string,
        leftSideValue: number,
        rightSideStat: string,
        rightSideValue: number
    }
) {
    return (
        <View className="flex-row flex-1">
            <View className="w-5">
                <Statbar stat={leftSideStat} value={leftSideValue}/>
            </View>

            <View className="flex-1 justify-center">
                <Tamagotchi />
            </View>

            <View className="w-5">
                <Statbar stat={rightSideStat} value={rightSideValue}/>
            </View>
        </View>
    )
}
