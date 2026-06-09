import { AppText } from '@/components/AppText';
import Pet from '@/components/widgets/Pet';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function PetSelection() {
    const [id, setId] = useState(2)

    return (
        <SafeAreaProvider>
            <SafeAreaView className='size-full justify-center'>
                <View className='flex-row'>
                    <Pressable className='w-1/5 bg-slate-300' onPress={() => setId(id-1)}>
                        <AppText>Left</AppText>
                    </Pressable>
                    <Pet id={id}/>
                    <Pressable className='w-1/5 bg-slate-300' onPress={() => setId(id+1)}>
                        <AppText>Right</AppText>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}