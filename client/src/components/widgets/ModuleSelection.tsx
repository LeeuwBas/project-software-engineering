import CheckIcon from '@/assets/icons/toolbar_icons/check.svg';
import { AppText } from '@/components/AppText';
import { EnabledModules } from '@/lib/storage';
import { MODULES } from '@/lib/types';
import { Pressable, View } from 'react-native';
import { CardContent } from '../ui/card';

type ModuleSelectionProps = {
  toggleModule: (moduleId: keyof EnabledModules) => void;
  isSelected: (moduleId: keyof EnabledModules) => boolean;
};

/** UI element for selecting which habits (modules) to track.
 * @param toggleModule callback function that toggles module on or off
 * @param isSelected callback function that lets know if module is selected
 *
 * @returns JSX element
 */
export function ModuleSelection({ toggleModule, isSelected }: ModuleSelectionProps) {
  const stressModule = MODULES.find((module) => module.id === 'stress');
  const habitModules = MODULES.filter((module) => module.id !== 'stress');

  return (
    <CardContent className="p-0">
      <View className="gap-2">
        <AppText className="mb-2 text-center text-xl font-bold">
          Would you like to keep track of stress?
        </AppText>

        {stressModule && (
          <Pressable
            onPress={() => toggleModule(stressModule.id)}
            className="flex-row items-center justify-between border-4 p-4"
            style={{
              backgroundColor: stressModule.color,
              borderColor: stressModule.borderColor,
              opacity: isSelected(stressModule.id) ? 1 : 0.4,
            }}>
            <View className="w-8" />

            <View className="flex-1 flex-row items-center justify-center gap-3">
              <stressModule.icon width={32} height={32} />
              <AppText className="text-xl font-bold">{stressModule.name}</AppText>
            </View>

            <View className="w-8 items-center justify-center">
              {isSelected(stressModule.id) ? (
                <CheckIcon
                  width={32}
                  height={32}
                  color={stressModule.selectColor ?? stressModule.borderColor}
                />
              ) : null}
            </View>
          </Pressable>
        )}
      </View>

      <View className="gap-2">
        <AppText className="my-2 text-center text-xl font-bold">
          Which habits would you like to track?
        </AppText>

        <View className="gap-2">
          {habitModules.map((module) => (
            <Pressable
              key={module.id}
              onPress={() => toggleModule(module.id)}
              className="flex-row items-center justify-between gap-3 border-4 p-4"
              style={{
                backgroundColor: module.color,
                borderColor: module.borderColor,
                opacity: isSelected(module.id) ? 1 : 0.4,
              }}>
              <View className="w-8" />

              <View className="flex-1 flex-row items-center justify-center gap-3">
                <module.icon width={32} height={32} />
                <AppText className="text-xl font-bold">{module.name}</AppText>
              </View>

              <View className="w-8 items-center justify-center">
                {isSelected(module.id) ? (
                  <CheckIcon
                    width={32}
                    height={32}
                    color={module.selectColor ?? module.borderColor}
                  />
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </CardContent>
  );
}
