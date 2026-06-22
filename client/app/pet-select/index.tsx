import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import Pet from '@/components/widgets/Pet';
import { useAuth } from '@/lib/auth/AuthManager';
import { getPetID, setPetID } from '@/lib/settings';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const NUM_PETS = 3;

export default function PetSelection() {
  const router = useRouter();
  const auth = useAuth();
  const isLoggedIn = auth.isAuthenticated || auth.isGuest;
  const pet = getPetID();
  const [draftPet, setDraftPet] = useState(pet);

  function previousPet() {
    if (draftPet === 0) {
      setDraftPet(NUM_PETS - 1);
    } else {
      setDraftPet(draftPet - 1);
    }
  }

  function nextPet() {
    if (draftPet === NUM_PETS - 1) {
      setDraftPet(0);
    } else {
      setDraftPet(draftPet + 1);
    }
  }

  function confirm() {
    setPetID(draftPet);
    isLoggedIn ? router.replace('/(protected)') : router.replace('/signup');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="size-full justify-center bg-background">
        <View className="flex-col gap-12">
          <View className="flex-row items-center justify-between">
            <View className="w-1/5">
              <Button
                variant="outline"
                className="mx-2 flex h-auto items-center py-0"
                onPress={previousPet}>
                <ChevronLeft width={80} height={80} />
              </Button>
            </View>

            <Pet className="w-1/2" id={draftPet} />

            <View className="w-1/5">
              <Button
                variant="outline"
                className="mx-2 flex h-auto items-center py-0"
                onPress={nextPet}>
                <ChevronRight width={80} height={80} />
              </Button>
            </View>
          </View>

          <View className="items-center gap-2">
            <Button className="size-auto" onPress={() => confirm()}>
              <AppText className="font-bold text-white">Choose pet</AppText>
            </Button>
            {!isLoggedIn && (
              <Button
                variant="outline"
                className="size-auto"
                onPress={() => router.replace('/login')}>
                <AppText className="font-bold">I already have an account</AppText>
              </Button>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
