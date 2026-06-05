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

    return (
        bgColor && (
        <View className='my-auto border-2 border-gray-500 w-full h-3/4 rounded-xl'>
            <View
            className='mt-auto w-full rounded-xl'
            style={{
                height: `${value}%`,
                backgroundColor: bgColor,
            }}
            />
        </View>
        )
    )
}
