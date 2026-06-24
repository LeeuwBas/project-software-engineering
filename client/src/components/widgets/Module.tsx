import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MenuConfig, ModuleId } from '@/lib/types';
import ThumbsDown from '@assets/icons/module_icons/thumbs_down.svg';
import ThumbsUp from '@assets/icons/module_icons/thumbs_up.svg';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';

const MAX_WATER = 25;
const MAX_FOOD = 12;

/**
 * Module component to be shown in menu popup. Each module has different components due to the nature of each stat.
 *
 * @param id id of the module
 * @param icon icon of the module
 * @param props props used in the module. See MenuConfig type
 */
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

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex max-w-full flex-row items-center justify-between gap-3">
        <View className="flex flex-row items-center gap-2">
          <Icon height={30} width={30} color={iconColor} />
        </View>
        {/* Water module */}
        {id === 'water' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="w-full flex-1 flex-row items-center justify-center gap-3">
            {/* Minus button */}
            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value <= 0}
              onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            {/* Values & goal */}
            <View className="flex min-w-16 flex-grow flex-row items-center justify-between gap-0 rounded-md border border-border px-2 py-3">
              <AppText className="text-base font-bold">{value}</AppText>
              <AppText className="text-xs font-bold"> / </AppText>
              <AppText className="text-left text-base font-bold">{goal}</AppText>
            </View>

            {/* Plus button */}
            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value >= MAX_WATER}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          </View>
        )}

        {/* Steps module */}
        {id === 'steps' && (
          <View className="px-auto flex flex-1 flex-row items-center justify-center gap-0 rounded-md border border-border py-3">
            <AppText className="text-base font-bold">{value}</AppText>
            <AppText className="text-xs font-bold"> / </AppText>
            <AppText className="text-left text-base font-bold">{goal}</AppText>
          </View>
        )}

        {/* Stress module */}
        {id === 'stress' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant="outline" className="h-12 flex-1 py-0" onPress={onPress}>
              <AppText>{buttonString}</AppText>
            </Button>
          </View>
        )}

        {/* Food module */}
        {id === 'food' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="w-full flex-1 flex-row items-center justify-center gap-3">
            {/* Minus button */}
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

            {/* Plus button */}
            <Button
              variant="outline"
              className="h-12 flex-grow"
              disabled={value >= MAX_FOOD}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          </View>
        )}

        {/* Sleep module */}
        {id === 'sleep' && setValue !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center gap-5">
            {/* Bad sleep */}
            <Button
              variant={value === 0 ? 'secondary' : 'outline'}
              className={'h-12 flex-1'}
              onPress={() => setValue(0)}>
              <ThumbsDown width={30} height={30} color={value === 0 ? '#ffffff' : '#aaaaaa'} />
            </Button>

            {/* Good sleep */}
            <Button
              variant={value === 1 ? 'secondary' : 'outline'}
              className={'h-12 flex-1'}
              onPress={() => setValue(1)}>
              <ThumbsUp width={30} height={30} color={value === 1 ? '#ffffff' : '#aaaaaa'} />
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
