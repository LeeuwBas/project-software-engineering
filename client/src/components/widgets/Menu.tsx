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
import { AttachStep } from 'react-native-spotlight-tour';

/** TODO (ZJWeng): docstring */
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

  useEffect(() => {
    if (!menuOpen) {
      setGoalsViewActive(false);
    }
  }, [menuOpen]);

  // Save input goals to goals view
  // Doesn't send to storage
  function submitGoals() {
    // Applies Math.ceil to all goals to prevent decimal numbers
    const finalGoals: Record<string, number> = Object.fromEntries(
      Object.entries(goals).map(([id, goal]) => [id, Math.ceil(goal)])
    );

    setGoals(finalGoals);
    setGoalsViewActive(false);
  }

  // Makes performance worse

  // if (!menuOpen) {
  //   return null;
  // }
  // TODO (ZJWeng): explain the general structure of the component
  return (
    <View
      pointerEvents={menuOpen ? 'auto' : 'none'}
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-[80%] justify-center shadow-block">
          <CardHeader className="w-full flex-row items-center justify-between">
            <CardTitle className="my-4 flex-1 text-2xl font-bold">{name}</CardTitle>
            {goalsViewActive ? (
              <Button onPress={submitGoals} className="py-0" variant="secondary">
                <AppText className="font-bold text-white">Back</AppText>
              </Button>
            ) : (
              <Button
                onPress={() => setGoalsViewActive(!goalsViewActive)}
                className="py-0"
                variant={'default'}>
                <AppText className="font-bold text-white">Change goals</AppText>
              </Button>
            )}
          </CardHeader>
          <CardContent className="w-full">
            {goalsViewActive ? (
              <GoalsView goals={goals} setGoals={setGoals} />
            ) : (
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
