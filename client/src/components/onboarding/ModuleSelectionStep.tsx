import { Pressable, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MODULES } from '@/lib/types';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export default function ModuleSelectionStep({ onNext, onBack }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      <AppText>Do you want to track stress?</AppText>
      <Pressable className="w-full rounded-xl flex-row bg-red-400 border-red-800 border-4 p-6">
        <AppText className='text-xl font-bold'>Stress</AppText>
      </Pressable>

      {onNext && (
        <Button className="py-0" onPress={onNext}>
          <AppText>Next</AppText>
        </Button>
      )}
    </View>
  );
}
