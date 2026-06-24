import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { PetSelector } from '@/components/widgets/PetSelector';
import { getPetID, setPetID } from '@/lib/settings';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

/**
 * Pet selection widget for the onboarding process.
 * Serves as an interface for a user to save their desired pet.
 *
 * @param {Props} onNext -
 *  Function to handle in-page routing to the next step of onboarding
 * @return {React.JSX.Element} Pet selection widget
 */
export function PetSelectionStep({ onNext }: { onNext: () => void }) {
  const router = useRouter();
  const pet = getPetID() ?? 0;
  const [draftPet, setDraftPet] = useState(pet);

  function confirm() {
    setPetID(draftPet);
    onNext();
  }
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
