import { AppText } from '@/components/AppText';
import { usePet } from '@/components/contexts/PetContext';
import { Button } from '@/components/ui/button';
import Pet from '@/components/widgets/Pet';
import { useAuth } from '@/lib/auth/AuthManager';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
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
          <View className="flex-row items-center justify-between">
            <View className="w-1/5">
              {draftPet !== 0 && (
                <Button
                  variant="outline"
                  className="mx-2 flex h-auto items-center"
                  onPress={() => setPetId(draftPet - 1)}>
                  <ChevronLeft size={80} />
                </Button>
              )}
            </View>

            <Pet className="w-1/2" id={draftPet} />

            <View className="w-1/5">
              {draftPet !== NUM_PETS - 1 && (
                <Button
                  variant="outline"
                  className="mx-2 flex h-auto items-center"
                  onPress={() => setPetId(draftPet + 1)}>
                  <ChevronRight size={80} />
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
