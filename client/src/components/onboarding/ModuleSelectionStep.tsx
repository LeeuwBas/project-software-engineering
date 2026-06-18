import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MODULES } from '@/lib/types';
import { Pressable, View } from 'react-native';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export default function ModuleSelectionStep({ onNext }: Props) {
  const stressModule = MODULES.find((module) => module.id === 'Stress');

  return (
    <View className="h-full items-center justify-center gap-4 px-4">
      <AppText className="text-bold">Do you want to track stress?</AppText>
      {stressModule && (
        <View key={stressModule.id} className="w-full justify-center">
          <Pressable
            className={`w-full flex-row rounded-xl border-4 p-6 gap-4`}
            style={{ backgroundColor: stressModule.color, borderColor: stressModule.borderColor }}>
            <stressModule.icon width={32} height={32} style={{ marginTop: -4 }}></stressModule.icon>
            <AppText className="text-xl font-bold">{stressModule.id}</AppText>
          </Pressable>
        </View>
      )}

      <AppText>Which habits do you want to track?</AppText>
      <View className="w-full gap-4">
        {MODULES.filter((module) => module.id !== 'Stress').map((module) => (
          <View key={module.id} className="w-full justify-center">
            <Pressable
              className={`w-full flex-row rounded-xl border-4 p-6 gap-4`}
              style={{ backgroundColor: module.color, borderColor: module.borderColor }}>
              <module.icon width={32} height={32} style={{ marginTop: -4 }}></module.icon>
              <AppText className="text-xl font-bold">{module.id}</AppText>
            </Pressable>
          </View>
        ))}
      </View>

      {onNext && (
        <Button className="py-0" onPress={onNext}>
          <AppText>Next</AppText>
        </Button>
      )}
    </View>
  );
}
