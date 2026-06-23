import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { PetSelector } from '@/components/widgets/PetSelector';
import { getPetID, setPetID } from '@/lib/settings';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  onNext?: () => void;
};

/** TODO (AlexAugustijn): docstring */
export function PetSelectionStep({ onNext }: Props) {
  const router = useRouter();
  const pet = getPetID();
  const [draftPet, setDraftPet] = useState(pet);

  // TODO (AlexAugustijn): explain
  function confirm() {
    setPetID(draftPet);
    onNext?.();
  }
  // TODO (AlexAugustijn): explain general layout
  return (
    <View className="flex-col gap-12">
      <PetSelector currentPet={draftPet} onPetChange={setDraftPet} />

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
