import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';

import { usePet } from '@/components/contexts/PetContext';
import Pet from '@/components/widgets/Pet';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { useRouter } from 'expo-router';
import { useState } from 'react';

type Props = {
  onNext?: () => void;
};

const NUM_PETS = 3;

export function PetSelectionStep({ onNext }: Props) {
  const router = useRouter();
  const { pet, setPet, savePet } = usePet();
  const [draftPet, setPetId] = useState(pet);

  function confirm() {
    setPet(draftPet);
    savePet(draftPet);
  }

  return (
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
        <Button
          onPress={() => {
            confirm();
            onNext?.();
          }}>
          <AppText className="font-bold text-white">Choose Pet & Sign Up</AppText>
        </Button>

        <Button variant="outline" onPress={() => router.push('/login')}>
          <AppText className="font-bold">I already have an account</AppText>
        </Button>
      </View>
    </View>
  );
}
