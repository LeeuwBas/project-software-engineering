import Pet from '@/components/widgets/Pet';
import Statbar from '@/components/widgets/Statbar';
import { View } from 'react-native';
import { usePet } from '../contexts/PetContext';

/** TODO (ZJWeng): delete this file? */
export default function Main({
  leftSideStat,
  leftSideValue,
  rightSideStat,
  rightSideValue,
}: {
  leftSideStat: string;
  leftSideValue: number;
  rightSideStat: string;
  rightSideValue: number;
}) {
  const { pet } = usePet();

  return (
    <View className="flex-1 flex-row">
      <View className="w-5">
        <Statbar stat={leftSideStat} value={leftSideValue} />
      </View>

      <View className="flex-1 justify-center">
        <Pet className="mx-auto w-3/5" id={pet} />
      </View>

      <View className="w-5">
        <Statbar stat={rightSideStat} value={rightSideValue} />
      </View>
    </View>
  );
}
