import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoalsView from '@/components/widgets/GoalsView';
import Module from '@/components/widgets/Module';
import { useAppContext } from '@/lib/AppContext';
import { getActiveModules, getPetName } from '@/lib/settings';
import { MenuConfig, ModuleId, MODULES } from '@/lib/types';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

/**
 * Menu popup containing all selected modules and a button and view for changing goals
 *
 * @param water @param setWater Draft water state
 * @param steps Steps taken
 * @param onStressPress What should happen when the stress button is pressed
 * @param food @param setFood Draft food state
 * @param goals @param setGoals Draft goals state
 */
export default function Menu({
  water,
  setWater,
  steps,
  onStressPress,
  food,
  setFood,
  sleep,
  setSleep,
  goals,
  setGoals,
}: {
  water: number;
  setWater: (water: number) => void;
  steps: number;
  onStressPress: () => void;
  food: number;
  setFood: (food: number) => void;
  sleep: number;
  setSleep: (sleep: number) => void;
  goals: Record<string, number>;
  setGoals: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [goalsViewActive, setGoalsViewActive] = useState(false);

  const name = getPetName();
  const { menuOpen } = useAppContext();

  // Values and functions used inside each module that are initialised in parent components
  const menuConfig: Record<ModuleId, MenuConfig> = {
    water: {
      value: water,
      setValue: setWater,
      goal: goals.water,
    },
    food: {
      value: food,
      setValue: setFood,
      goal: goals.food,
    },
    sleep: {
      value: sleep,
      setValue: setSleep,
    },
    steps: {
      value: steps,
      goal: goals.steps,
    },
    stress: {
      onPress: onStressPress,
      buttonString: 'Log Stress',
    },
  };

  const activeModules = MODULES.filter((module) => getActiveModules()[module.id]);

  const ifGoaledModules: boolean = activeModules.some((module) => 'goalConfig' in module);

  useEffect(() => {
    if (!menuOpen) {
      setGoalsViewActive(false);
    }
  }, [menuOpen]);

  return (
    <View
      pointerEvents={menuOpen ? 'auto' : 'none'}
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-[80%] justify-center shadow-block">
          <CardHeader className="w-full flex-row items-center justify-between">
            {/* Pet name */}
            <CardTitle className="my-4 flex-1 text-2xl font-bold">{name}</CardTitle>

            {/* Goal button */}
            {ifGoaledModules &&
              (goalsViewActive ? (
                <Button
                  onPress={() => setGoalsViewActive(false)}
                  className="py-0"
                  variant="secondary">
                  <AppText className="font-bold text-white">Back</AppText>
                </Button>
              ) : (
                <Button
                  onPress={() => setGoalsViewActive(!goalsViewActive)}
                  className="py-0"
                  variant={'default'}>
                  <AppText className="font-bold text-white">Change goals</AppText>
                </Button>
              ))}
          </CardHeader>

          {/* Goals or modules */}
          <CardContent className="w-full">
            {goalsViewActive ? (
              <GoalsView goals={goals} setGoals={setGoals} />
            ) : (
              // List of modules
              <View className="flex-col gap-5">
                {activeModules.map((module) => (
                  <Module
                    key={module.id}
                    id={module.id}
                    icon={module.icon}
                    props={menuConfig[module.id]}
                  />
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
