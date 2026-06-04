import Sidebar from '@/components/widgets/Sidebar';
import Tamagotchi from '@/components/widgets/Tamagotchi';
import { View } from 'react-native';

export default function Main() {
    return (
        <View className="flex-row flex-1">
            <View className="w-5">
                <Sidebar value={30}/>
            </View>

            <View className="flex-1 justify-center">
                <Tamagotchi />
            </View>

            <View className="w-5">
                <Sidebar value={50}/>
            </View>
        </View>
    )
}
