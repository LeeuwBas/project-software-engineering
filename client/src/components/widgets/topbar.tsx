import { Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';

export default function Topbar() {
    const date = new Date();
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })

    return (
        <View className="flex flex-row items-center">
            <View className='ml-5'>
                <Text className=' text-2xl font-bold'>{day}</Text>
            </View>

            <View className='ml-auto flex-row gap-2 mr-10'>
                {Array.from({ length: 3 }).map((_, index) => (
                <Heart key={index} fill={"#FF0000"} />
                ))}
            </View>
        </View>
    )
}