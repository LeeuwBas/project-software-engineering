import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MODULES } from '@/lib/types';
import { Pressable, View } from 'react-native';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export default function ModuleSelectionStep({ onNext, onBack }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      {MODULES.map((module) => (
        <View>
          <AppText>Do you want to track {module.id}?</AppText>
          <Pressable className={`w-full flex-row rounded-xl border-4 p-6 bg-[${module.color}]`}>
            <AppText className="text-xl font-bold">{module.id}</AppText>
          </Pressable>
        </View>
      ))}

      {onNext && (
        <Button className="py-0" onPress={onNext}>
          <AppText>Next</AppText>
        </Button>
      )}
    </View>
  );
}
