import { AppText } from "@/components/AppText"
import getMood from "@/lib/mood"
import { LinearGradient } from "expo-linear-gradient"
import { Frown, Smile } from "lucide-react-native"
import { View } from "react-native"

export default function Happiness() {
    // TODO: calculate happiness based on number of tasks completed.
    const happiness = 100
    const mood = getMood(happiness)

    return (
        <View className='w-1/2 px-2'>
            <AppText className='mx-auto'>Mood: {mood}</AppText>
            <View className='flex-row gap-1 justify-center'>
                <Frown size={20}/>
                <View className='h-5 flex-1 border-4 border-gray-500 bg-white'>
                    <LinearGradient
                        colors={['#397cf7', '#f5ec9a', '#f7df05']}
                        start={[0, 1]}
                        end={[1, 0]}
                        className='mr-auto h-full w-full'
                        />
                    <View
                        className='absolute right-0 top-0 bottom-0 bg-white'
                        style={{width: `${100-happiness}%`}}
                        />
                </View>
                <Smile size={20}/>
            </View>
        </View>
    )
}