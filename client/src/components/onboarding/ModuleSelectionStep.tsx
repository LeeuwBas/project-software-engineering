import { View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export default function StepName({ onNext, onBack }: Props) {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <AppText>Step Name</AppText>

      {onBack && (
        <Button className="py-0" onPress={onBack}>
          <AppText>Back</AppText>
        </Button>
      )}

      {onNext && (
        <Button className="py-0" onPress={onNext}>
          <AppText>Next</AppText>
        </Button>
      )}
    </View>
  );
}