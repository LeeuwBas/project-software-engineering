import { AppText } from '@/components/AppText';
import { usePet } from '@/components/contexts/PetContext';
import Pet from '@/components/widgets/Pet';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const NUM_PETS = 3

export default function PetSelection() {
    const router = useRouter()
    const {id, setId, saveId} = usePet()

    function alterId(value: number) {
        const new_id = id+value
        if (new_id < 0 || new_id >= NUM_PETS) return
        setId(id+value)
    }

    function confirm() {
        saveId(id)
        router.back()
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className='size-full justify-center'>
                <View className='flex-col gap-12'>
                    <View className='flex-row'>
                        <Pressable className='w-1/5 bg-slate-300' onPress={() => alterId(-1)}>
                            <AppText>Left</AppText>
                        </Pressable>
                        <Pet id={id}/>
                        <Pressable className='w-1/5 bg-slate-300' onPress={() => alterId(+1)}>
                            <AppText>Right</AppText>
                        </Pressable>
                    </View>
                    <View className='items-center'>
                        <Pressable className='w-1/2 bg-slate-400' onPress={() => confirm()}>
                            <AppText>Confirm</AppText>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}