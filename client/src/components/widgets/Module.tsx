import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { ModuleProps } from '@/lib/types';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';

export default function Module({
  props: { id, icon: Icon, value, setValue, goal, onPress, buttonString },
}: {
  props: ModuleProps;
}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  const valueWidth = (goal?.toString().length ?? 0) * 3;
  
  const PlusButton =
    setValue !== undefined && value !== undefined ? (
      <Button variant="outline" disabled={value === goal} onPress={() => setValue(value + 1)}>
        <Plus size={20} />
      </Button>
    ) : null;

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <Icon height={30} width={30} color={iconColor} />

        <View className="mx-auto flex-1 flex-row items-center justify-center">
          {/* Minus button */}
          {setValue !== undefined && value !== undefined && (
            <Button variant={'outline'} disabled={value === 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>
          )}
          {/* Value */}
          {value !== undefined && goal !== undefined && (
            <View className="flex-row items-center">
              <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>
          )}
          {/* Plus button */}
          {PlusButton &&
            (id === 'water' ? (
              <AttachStep index={3} style={{ alignSelf: 'center' }}>
                {PlusButton}
              </AttachStep>
            ) : (
              PlusButton
            ))}

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
