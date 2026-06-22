import { AppText } from '@/components/AppText';
import { usePet } from '@/components/contexts/PetContext';
import { Button } from '@/components/ui/button';
import Pet from '@/components/widgets/Pet';
import { useAuth } from '@/lib/auth/AuthManager';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const NUM_PETS = 3;

/** TODO (ZJWeng): docstring, and add some comments explaining sections */
export default function PetSelection() {
  const router = useRouter();
  const auth = useAuth();
  const isLoggedIn = auth.isAuthenticated || auth.isGuest;
  const { pet, setPet, savePet } = usePet();
  const [draftPet, setPetId] = useState(pet);

  function confirm() {
    setPet(draftPet);
    savePet(draftPet);
    isLoggedIn ? router.push('/') : router.push('/signup');
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView className="size-full justify-center bg-background">
        <View className="flex-col gap-12">
          <View className="flex-row items-center justify-between">
            <View className="w-1/5">
              {draftPet !== 0 && (
                <Button
                  variant="outline"
                  className="mx-2 flex h-auto items-center py-0"
                  onPress={() => setPetId(draftPet - 1)}>
                  <ChevronLeft width={80} height={80} />
                </Button>
              )}
            </View>

            <Pet className="w-1/2" id={draftPet} />

            <View className="w-1/5">
              {draftPet !== NUM_PETS - 1 && (
                <Button
                  variant="outline"
                  className="mx-2 flex h-auto items-center py-0"
                  onPress={() => setPetId(draftPet + 1)}>
                  <ChevronRight width={80} height={80} />
                </Button>
              )}
            </View>
          </View>

          <View className="items-center gap-2">
            <Button className="size-auto" onPress={() => confirm()}>
              <AppText className="font-bold text-white">Choose pet</AppText>
            </Button>
            {!isLoggedIn && (
              <Button variant="outline" className="size-auto" onPress={() => router.push('/login')}>
                <AppText className="font-bold">I already have an account</AppText>
              </Button>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
