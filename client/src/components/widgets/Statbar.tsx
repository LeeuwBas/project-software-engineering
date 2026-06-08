import { GlassWater } from 'lucide-react-native';
import { View } from 'react-native';

export default function Statbar(
    {
        stat,
        value
    }: {
        stat: string,
        value : number
    }) {

    let bgColor: string | null = null
    switch (stat) {
        case 'none':
            break;
        case 'water':
            bgColor = '#74ccf4';
            break;
        default:
            console.error('Unknown stat');
    }

    if (!bgColor) {
        return
    }

    return (
        bgColor && (
            <View className='my-auto h-1/2 m-1 w-full'>
                <GlassWater size={20}/>
                <View className='my-auto border-4 bg-white border-gray-500 flex-auto'>
                    <View
                    className='mt-auto'
                    style={{
                        height: `${value}%`,
                        backgroundColor: bgColor,
                    }}
                    />
                </View>
            </View>
        )
    )
}
