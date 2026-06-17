import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { ModuleProps } from '@/lib/types';
import { Minus, Plus } from 'lucide-react-native';
import { View } from 'react-native';

export default function Module({
  props: { icon: Icon, value, setValue, goal, onPress, buttonString },
}: {
  props: ModuleProps;
}) {
  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <Icon height={30} width={30} />

        <View
          className={`flex-1 flex-row items-center ${
            setValue !== undefined ? 'justify-between' : 'justify-center'
          }`}>
          {/* Plus button */}
          {setValue !== undefined && value !== undefined && (
            <Button
              variant={'outline'}
              disabled={value === goal}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          )}
          {/* Value */}
          {value !== undefined && goal !== undefined && (
            <View className="flex-row items-center">
              <AppText className="w-10 text-right text-base font-bold">{value}</AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText className="w-10 text-left text-base font-bold">{goal}</AppText>
            </View>
          )}
          {/* Minus button */}
          {setValue !== undefined && value !== undefined && (
            <Button variant="outline" disabled={value === 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>
          )}
          {onPress !== undefined && buttonString !== undefined && (
            <Button variant="outline" className="py-0" onPress={onPress}>
              <AppText>{buttonString}</AppText>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
