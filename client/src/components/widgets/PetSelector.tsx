import Pet from '@/components/widgets/Pet';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { Pressable, View } from 'react-native';

type PetSelectorProps = {
  currentPet: number;
  onPetChange: (id: number) => void;
  maxPets: number;
};

export function PetSelector({ currentPet, onPetChange, maxPets }: PetSelectorProps) {
  function previousPet() {
    if (currentPet === 0) {
      onPetChange(maxPets - 1);
    } else {
      onPetChange(currentPet - 1);
    }
  }

  function nextPet() {
    if (currentPet === maxPets - 1) {
      onPetChange(0);
    } else {
      onPetChange(currentPet + 1);
    }
  }

  return (
    <View className="flex-row items-center justify-between">
      <View className="w-1/5 items-center justify-center">
        <Pressable
          onPress={previousPet}
          hitSlop={12}
          className="h-12 w-12 items-center justify-center">
          <ChevronLeft width={36} height={36} />
        </Pressable>
      </View>

      <Pet className="w-1/2" id={currentPet} />

      <View className="w-1/5 items-center justify-center">
        <Pressable
          onPress={nextPet}
          hitSlop={12}
          className="h-12 w-12 items-center justify-center">
          <ChevronRight width={36} height={36} />
        </Pressable>
      </View>
    </View>
  );
}