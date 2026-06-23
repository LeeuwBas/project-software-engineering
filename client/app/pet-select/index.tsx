import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { PetSelector } from '@/components/widgets/PetSelector';
import { getPetID, setPetID } from '@/lib/settings';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/** TODO (ZJWeng): docstring, and add some comments explaining sections */
export default function PetSelection() {
  const router = useRouter();
  const pet = getPetID() ?? 0;
  const [draftPet, setDraftPet] = useState(pet);

  function confirm() {
    setPetID(draftPet);
    router.replace('/(protected)');
  }

  return (
    <ImageBackground
      source={require('@assets/background_login.png')}
      contentFit="cover"
      style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView className="size-full justify-center">
          <View className="flex-col gap-12">
            <PetSelector currentPet={draftPet} onPetChange={setDraftPet} />

            <View className="items-center gap-2">
              <Button className="size-auto" onPress={confirm}>
                <AppText className="font-bold text-white">Choose pet</AppText>
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
