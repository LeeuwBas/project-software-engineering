import Pet from '@/components/widgets/Pet';
import Statbar from '@/components/widgets/Statbar';
import { View } from 'react-native';
import { usePet } from '../contexts/PetContext';

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
    const {id} = usePet()

    return (
        <View className="flex-row flex-1">
            <View className="w-5">
                <Statbar stat={leftSideStat} value={leftSideValue}/>
            </View>

            <View className="flex-1 justify-center">
                <Pet id={id}/>
            </View>

            <View className="w-5">
                <Statbar stat={rightSideStat} value={rightSideValue}/>
            </View>
        </View>
    )
}
