import Pet from '@/components/widgets/Pet';
import ChevronLeft from '@assets/icons/toolbar_icons/chevron_left.svg';
import ChevronRight from '@assets/icons/toolbar_icons/chevron_right.svg';
import { useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

type PetSelectorProps = {
  currentPet: number;
  onPetChange: (id: number) => void;
  maxPets: number;
};

const VIRTUAL_LOOPS = 50;

export function PetSelector({ currentPet, onPetChange, maxPets }: PetSelectorProps) {
  const listRef = useRef<FlatList>(null);
  const [width, setWidth] = useState(0);
  
  const initialIndex = Math.floor(VIRTUAL_LOOPS / 2) * maxPets + currentPet;
  const [localIndex, setLocalIndex] = useState(initialIndex);
  
  const totalItems = maxPets * VIRTUAL_LOOPS;
  const data = Array.from({ length: totalItems }, (_, index) => index % maxPets);

  function updatePetSelection(newIndex: number) {
    setLocalIndex(newIndex);
    onPetChange(data[newIndex]);
  }

  function previousPet() {
    const nextIdx = localIndex - 1;
    updatePetSelection(nextIdx);
    listRef.current?.scrollToIndex({ index: nextIdx, animated: true });
  }

  function nextPet() {
    const nextIdx = localIndex + 1;
    updatePetSelection(nextIdx);
    listRef.current?.scrollToIndex({ index: nextIdx, animated: true });
  }

  return (
    <View 
      className="w-full justify-center"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <FlatList
          ref={listRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          windowSize={5}
          keyExtractor={(_, index) => index.toString()}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            if (index !== localIndex) {
              updatePetSelection(index);
            }
          }}
          renderItem={({ item }) => (
            <View style={{ width }} className="items-center justify-center">
              <Pet className="w-1/2" id={item} />
            </View>
          )}
        />
      )}

      <Pressable
        onPress={previousPet}
        hitSlop={12}
        className="absolute left-8 z-10 h-12 w-12 items-center justify-center">
        <ChevronLeft width={36} height={36} />
      </Pressable>

      <Pressable
        onPress={nextPet}
        hitSlop={12}
        className="absolute right-8 z-10 h-12 w-12 items-center justify-center">
        <ChevronRight width={36} height={36} />
      </Pressable>
    </View>
  );
}