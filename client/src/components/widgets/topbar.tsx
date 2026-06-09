import { AppText } from '@/components/AppText';
import Weather from '@/components/widgets/Weather';
import getMood from '@/lib/mood';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export default function Topbar() {
    const date = new Date();
    const day = date.toLocaleDateString('en-US', { weekday: 'short' })

    // TODO: calculate happiness based on number of tasks completed.
    const happiness = 40
    const mood = getMood(happiness)

    return (
        <View className="flex flex-row items-center">
            <View className='pl-5 pt-2 w-1/2 flex-row gap-2'>
                <Weather/>
                <AppText className=' text-2xl font-bold'>{day}</AppText>
            </View>

            <View className='mx-auto w-1/3'>
                <AppText className='mx-auto'>Mood: {mood}</AppText>
                <View className='h-5 border-4 border-gray-500 bg-white'>
                    <LinearGradient
                        colors={['#397cf7', '#c5c981', '#f0f00e']}
                        start={[0, 1]}
                        end={[1, 0]}
                        className='mr-auto h-full w-full'
                        />
                    <View
                        className='absolute right-0 top-0 bottom-0 bg-white'
                        style={{width: `${100-happiness}%`}}
                        />
                </View>
            </View>
        </View>
    )
}
