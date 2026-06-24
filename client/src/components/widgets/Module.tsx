import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MenuConfig, ModuleId } from '@/lib/types';
import ThumbsDown from '@assets/icons/module_icons/thumbs_down.svg';
import ThumbsUp from '@assets/icons/module_icons/thumbs_up.svg';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';
import { SvgProps } from 'react-native-svg';
import Bar from './Bar';
import { Separator } from '../ui/separator';

const MAX_WATER = 25;
const MAX_FOOD = 12;

/** TODO (ZJWeng): docstring */
export default function Module({
  id,
  icon: Icon,
  props,
}: {
  id: ModuleId;
  icon: React.FC<SvgProps>;
  props?: MenuConfig;
}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const { value, setValue, goal, onPress, buttonString } = props ?? {};

  const valueWidth = Math.max(String(goal ?? '').length, String(value ?? '').length) * 3;
  // TODO (ZJWeng, Dorus-vda): explain component structure
  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex max-w-full flex-row items-center justify-between gap-4">
        <View className="flex flex-row items-center gap-2">
          <Icon height={30} width={30} color={iconColor} />
        </View>
        {/* Water module */}
        {id === 'water' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="w-full flex-1 flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value <= 0}
              onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            <View className="flex min-w-16 flex-grow flex-row items-center justify-between gap-0 rounded-md border border-border px-2 py-3">
              <AppText className="text-base font-bold">{value}</AppText>
              <AppText className="text-xs font-bold"> / </AppText>
              <AppText className="text-left text-base font-bold">{goal}</AppText>
            </View>

            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value >= MAX_WATER}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          </View>
        )}

        {id === 'steps' && (
          <View className="px-auto flex flex-1 flex-row items-center justify-center gap-0 rounded-md border border-border py-3">
            <AppText className="text-base font-bold">{value}</AppText>
            <AppText className="text-xs font-bold"> / </AppText>
            <AppText className="text-left text-base font-bold">{goal}</AppText>
          </View>
        )}

        {id === 'stress' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant="outline" className="h-12 flex-1 py-0" onPress={onPress}>
              <AppText>{buttonString}</AppText>
            </Button>
          </View>
        )}

        {id === 'food' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="w-full flex-1 flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value <= 0}
              onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            <View className="flex min-w-16 flex-grow flex-row items-center justify-between gap-0 rounded-md border border-border px-2 py-3">
              <AppText className="text-base font-bold">{value}</AppText>
              <AppText className="text-xs font-bold"> / </AppText>
              <AppText className="text-left text-base font-bold">{goal}</AppText>
            </View>

            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value >= MAX_FOOD}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          </View>
        )}

        {id === 'sleep' && setValue !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center gap-5">
            <Button
              variant={value === -1 ? 'secondary' : 'outline'}
              className={'h-12 flex-1'}
              onPress={() => setValue(-1)}>
              {/*<Button onPress={() => setValue(1)} className={`${value !== 1 && 'opacity-30'}`}>*/}
              <ThumbsDown width={30} height={30} color={value === -1 ? '#ffffff' : '#aaaaaa'} />
            </Button>

            <Button
              variant={value === 1 ? 'secondary' : 'outline'}
              className={'h-12 flex-1'}
              onPress={() => setValue(1)}>
              {/*<Button onPress={() => setValue(1)} className={`${value !== 1 && 'opacity-30'}`}>*/}
              <ThumbsUp width={30} height={30} color={value === 1 ? '#ffffff' : '#aaaaaa'} />
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
