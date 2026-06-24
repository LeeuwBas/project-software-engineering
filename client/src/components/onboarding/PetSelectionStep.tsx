import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { PetSelector } from '@/components/widgets/PetSelector';
import { getPetID, initSettings, setPetID } from '@/lib/settings';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

/** TODO (AlexAugustijn): docstring */
export function PetSelectionStep({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const pet = getPetID() ?? 0;
  const [draftPet, setDraftPet] = useState(pet);

  useEffect(() => initSettings(), [])

  // TODO (AlexAugustijn): explain
  function confirm() {
    setPetID(draftPet);
    onNext();
  }
  // TODO (AlexAugustijn): explain general layout
  return (
    <View className="flex-col gap-12">
      <PetSelector currentPet={draftPet} onPetChange={setDraftPet} />

      <View className="w-full gap-2 px-12">
        <Button onPress={confirm}>
          <AppText className="font-bold text-white">Choose Companion</AppText>
        </Button>

        <Button variant="outline" onPress={() => router.push('/login')}>
          <AppText className="font-bold">I already have an account</AppText>
        </Button>
      </View>
    </View>
  );
}
