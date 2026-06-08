import { Button } from '@/components/ui/button';
import { SportShoe } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { AppText } from '../AppText';
export default function StepsWidget() {

    return (
        <>
            <View className='flex flex-row items-center w-full p-2 justify-between'>
                <View className='flex flex-row items-center gap-2'>
                    <SportShoe size={30}/>
                </View>

                <View className='flex flex-row items-center gap-2'>
                    <AppText>9999</AppText>
                </View>
            </View>
        </>
    );
}
