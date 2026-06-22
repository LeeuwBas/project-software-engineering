import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Pressable, View } from 'react-native';

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

/** TODO (AlexAugustijn): docstring */
export function PetSelectionStep({ onNext }: Props) {
  const router = useRouter();
  const { pet, setPet, savePet } = usePet();
  const [draftPet, setPetId] = useState(pet);

  // TODO (AlexAugustijn): explain
  function confirm() {
    setPet(draftPet);
    savePet(draftPet);

    onNext?.();
  }
  // TODO (AlexAugustijn): explain general layout
  return (
    <View className="flex-col gap-12">
      <View className="flex-row items-center justify-between">
        <View className="w-1/5 items-center justify-center">
          {draftPet !== 0 ? (
            <Pressable
              onPress={() => setPetId(draftPet - 1)}
              hitSlop={12}
              className="h-12 w-12 items-center justify-center">
              <ChevronLeft width={36} height={36} />
            </Pressable>
          ) : (
            <View className="h-12 w-12" />
          )}
        </View>

        <Pet className="w-1/2" id={draftPet} />

        <View className="w-1/5 items-center justify-center">
          {draftPet !== NUM_PETS - 1 ? (
            <Pressable
              onPress={() => setPetId(draftPet + 1)}
              hitSlop={12}
              className="h-12 w-12 items-center justify-center">
              <ChevronRight width={36} height={36} />
            </Pressable>
          ) : (
            <View className="h-12 w-12" />
          )}
        </View>
      </View>

      <View className="w-full gap-2 px-12">
        <Button onPress={confirm}>
          <AppText className="font-bold text-white">Choose companion</AppText>
        </Button>

        <Button variant="outline" onPress={() => router.push('/login')}>
          <AppText className="font-bold">I already have an account</AppText>
        </Button>
      </View>
    </View>
  );
}
