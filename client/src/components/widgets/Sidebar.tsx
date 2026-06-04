import { View } from 'react-native'

export default function Sidebar({value} : {value : number}) {
    return (
        <View className='my-auto border-2 border-gray-500 w-full h-3/4 rounded-xl'>
            <View className='mt-auto bg-blue-400 rounded-xl w-full' style={{height: `${value}%`}} />
        </View>
    )
}
