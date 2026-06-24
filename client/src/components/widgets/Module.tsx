import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { MenuConfig, ModuleId } from '@/lib/types';
import ThumbsDown from '@assets/icons/module_icons/thumbs_down.svg';
import ThumbsUp from '@assets/icons/module_icons/thumbs_up.svg';
import { Minus, Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native';
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

  // Width of the box containing the value and goal
  const valueWidth = Math.max(String(goal ?? '').length, String(value ?? '').length) * 3;

  return (
    <View className="flex w-full flex-row items-center justify-between">
      <View className="flex flex-row items-center justify-between gap-2">
        <Icon height={30} width={30} color={iconColor} />
        {/* Water module */}
        {id === 'water' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            {/* Minus button */}
            <Button variant={'outline'} disabled={value <= 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            {/* Value & goals */}
            <View className="flex-row items-center">
              <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>

            {/* Plus button */}
            <Button
              variant="outline"
              disabled={value >= MAX_WATER}
              onPress={() => setValue(value + 1)}>
              <Plus size={20} />
            </Button>
          </View>
        )}

        {/* Steps module */}
        {id === 'steps' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
              {value}
            </AppText>
            <AppText className="w-4 text-center text-base font-bold"> / </AppText>
            <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
              {goal}
            </AppText>
          </View>
        )}

        {/* Stress module */}
        {id === 'stress' && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            <Button variant="outline" className="py-0" onPress={onPress}>
              <AppText>{buttonString}</AppText>
            </Button>
          </View>
        )}

        {/* Food module */}
        {id === 'food' && setValue !== undefined && value !== undefined && goal !== undefined && (
          <View className="mx-auto flex-1 flex-row items-center justify-center">
            {/* Minus button */}
            <Button variant={'outline'} disabled={value <= 0} onPress={() => setValue(value - 1)}>
              <Minus size={20} />
            </Button>

            {/* Value & goal */}
            <View className="flex-row items-center">
              <AppText style={{ width: valueWidth * 4 }} className="text-right text-base font-bold">
                {value}
              </AppText>
              <AppText className="w-4 text-center text-base font-bold"> / </AppText>
              <AppText style={{ width: valueWidth * 4 }} className="text-left text-base font-bold">
                {goal}
              </AppText>
            </View>

            {/* Plus button */}
            <Button
              variant="outline"
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
            <Pressable onPress={() => setValue(0)} className={`${value !== 0 && 'opacity-30'}`}>
              <ThumbsDown width={30} height={30} color={'#b41b21'} />
            </Pressable>

            {/* Good sleep */}
            <Pressable onPress={() => setValue(1)} className={`${value !== 1 && 'opacity-30'}`}>
              <ThumbsUp width={30} height={30} color={'#22a022'} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}
