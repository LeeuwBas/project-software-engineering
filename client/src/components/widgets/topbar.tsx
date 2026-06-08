import { Sun } from 'lucide-react-native';
import { View } from 'react-native';
import { AppText } from '../AppText';

function Mood(happiness: number) {
    switch (true) {
        case happiness < 20:
            return 'Sad'
        case happiness < 40:
            return 'Gloomy'
        case happiness < 60:
            return 'Neutral'
        case happiness < 80:
            return 'Content'
    }
    return 'Happy'
}

export default function Topbar() {
    const date = new Date();
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })

    const happiness = 30
    const mood = Mood(happiness)

    return (
        <View className="flex flex-row items-center">
            <View className='ml-5 w-1/2 flex-row gap-2'>
                {/* TODO: Add logic with weather API */}
                    <Sun size={30}/>
                    <AppText className=' text-2xl font-bold'>{day}</AppText>
            </View>

            <View className='mx-auto w-1/3'>
                <AppText className='mx-auto'>Mood: {mood}</AppText>
                <View className='h-5 border-4 border-gray-500 bg-white'>
                    <View
                        className='mr-auto bg-[#ffd568] h-full'
                        style={{
                            width: `${happiness}%`,
                        }}
                        />
                </View>
            </View>
        </View>
    )
}
