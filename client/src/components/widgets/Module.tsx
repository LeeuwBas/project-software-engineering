import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { ModuleProps } from '@/lib/types';
import { Minus, Plus, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View, Pressable } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';

export default function Module({
  props: { id, icon: Icon, value, setValue, goal, onPress, buttonString },
}: {
  props: ModuleProps;
}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';
  const valueWidth = Math.max(String(goal ?? '').length, String(value ?? '').length) * 3;

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2 justify-between">
        <Icon height={30} width={30} color={iconColor} />
        {/* Water module */}
        {id === 'water' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant={'outline'} disabled={value === 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            <View className="flex-row items-center">
              <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>

            <AttachStep index={3} style={{ alignSelf: 'center' }}>
              <Button variant="outline" disabled={value === goal} onPress={() => setValue(value + 1)}>
                <Plus size={20} />
              </Button>
            </AttachStep>
          </View>
        )}

        {id === 'steps' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
              <AppText className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>
        )}

        {id === 'stress' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant="outline" className="py-0" onPress={onPress}>
              <AppText>{buttonString}</AppText>
            </Button>
          </View>
        )}

        {id === 'food' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant={'outline'} disabled={value === 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            <View className="flex-row items-center">
              <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>

            <AttachStep index={3} style={{ alignSelf: 'center' }}>
              <Button variant="outline" disabled={value === goal} onPress={() => setValue(value + 1)}>
                <Plus size={20} />
              </Button>
            </AttachStep>
          </View>
        )}

        {id === 'sleep' && setValue !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center gap-5">
            <Pressable onPress={() => setValue(0)} className={`${value === 1 ? 'opacity-15' : ''}`}>
              <ThumbsDown fill={"#FF0000"} size={30} />
            </Pressable>

            <Pressable onPress={() => setValue(1)} className={`${value === 1 ? '' : 'opacity-15'}`}>
              <ThumbsUp fill={"#00FF00"}  size={30}/>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
