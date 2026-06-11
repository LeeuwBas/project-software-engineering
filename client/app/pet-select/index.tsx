import { AppText } from '@/components/AppText';
import { usePet } from '@/components/contexts/PetContext';
import Pet from '@/components/widgets/Pet';
import { useAuth } from '@/lib/auth/AuthManager';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const NUM_PETS = 3;

export default function PetSelection() {
  const router = useRouter();
  const auth = useAuth();
  const isLoggedIn = auth?.accessToken;
  const { pet, setPet, savePet } = usePet();
  const [draftPet, setPetId] = useState(pet);

  function confirm() {
    setPet(draftPet);
    savePet(draftPet);
    isLoggedIn ? router.back() : router.push('/signup');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="size-full justify-center">
        <View className="flex-col gap-12">
          <View className="flex-row">
            <View className="w-1/5">
              {draftPet !== 0 && (
                <Pressable className="bg-slate-300" onPress={() => setPetId(draftPet - 1)}>
                  <AppText>Left</AppText>
                </Pressable>
              )}
            </View>

            <Pet id={draftPet} />

            <View className="w-1/5">
              {draftPet !== NUM_PETS - 1 && (
                <Pressable className="bg-slate-300" onPress={() => setPetId(draftPet + 1)}>
                  <AppText>Right</AppText>
                </Pressable>
              )}
            </View>
          </View>

          <View className="items-center gap-2">
            <Pressable className="w-1/2 bg-slate-400" onPress={() => confirm()}>
              <AppText>Confirm</AppText>
            </Pressable>
            {!isLoggedIn && (
              <Pressable className="w-1/2 bg-slate-400" onPress={() => router.push('/login')}>
                <AppText>I already have an account</AppText>
              </Pressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
