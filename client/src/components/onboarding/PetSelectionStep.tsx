import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { getPetID, setPetID } from '@/lib/settings';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { PetSelector } from '@/components/widgets/PetSelector';

type Props = {
  onNext?: () => void;
};

const NUM_PETS = 3;

export function PetSelectionStep({ onNext }: Props) {
  const router = useRouter();
  const pet = getPetID();
  const [draftPet, setDraftPet] = useState(pet);

  function confirm() {
    setPetID(draftPet);
    onNext?.();
  }

  return (
    <View className="flex-col gap-12">
      <PetSelector currentPet={draftPet} onPetChange={setDraftPet} maxPets={NUM_PETS} />

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
