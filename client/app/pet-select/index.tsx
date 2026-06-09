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

    function confirm() {
        saveId(id)
        router.back()
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className='size-full justify-center'>
                <View className='flex-col gap-12'>
                    <View className='flex-row'>
                        <View className='w-1/5'>
                            {id !== 0 &&
                                <Pressable className='bg-slate-300' onPress={() => setId(id-1)}>
                                    <AppText>Left</AppText>
                                </Pressable>
                            }
                        </View>

                        <Pet id={id}/>

                        <View className='w-1/5'>
                            {id !== NUM_PETS-1 &&
                                <Pressable className='bg-slate-300' onPress={() => setId(id+1)}>
                                    <AppText>Right</AppText>
                                </Pressable>
                            }
                        </View>
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