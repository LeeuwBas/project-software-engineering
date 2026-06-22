import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import Pet from '@/components/widgets/Pet';
import { getPetID, setPetID } from '@/lib/settings';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  onNext?: () => void;
};

const NUM_PETS = 3;

export function PetSelectionStep({ onNext }: Props) {
  const router = useRouter();
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

    onNext?.();
  }

  return (
    <View className="flex-col gap-12">
      <View className="flex-row items-center justify-between">
        <View className="w-1/5 items-center justify-center">
          <Pressable
            onPress={previousPet}
            hitSlop={12}
            className="h-12 w-12 items-center justify-center">
            <ChevronLeft width={36} height={36} />
          </Pressable>
        </View>

        <Pet className="w-1/2" id={draftPet} />

        <View className="w-1/5 items-center justify-center">
          <Pressable
            onPress={nextPet}
            hitSlop={12}
            className="h-12 w-12 items-center justify-center">
            <ChevronRight width={36} height={36} />
          </Pressable>
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
