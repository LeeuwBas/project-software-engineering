import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoalsView from '@/components/widgets/GoalsView';
import Module from '@/components/widgets/Module';
import { useAppContext } from '@/lib/AppContext';
import { getActiveModules } from '@/lib/settings';
import { MenuConfig, ModuleDefinition, ModuleId, MODULES } from '@/lib/types';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';

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
  // TODO: Add backend for retrieving name
  const name = 'Alex';
  const { menuOpen } = useAppContext();

  const menuConfig: Record<ModuleId, MenuConfig> = {
    water: {
      value: water,
      setValue: setWater,
      goal: goals.water,
    },
    steps: {
      value: steps,
      goal: goals.steps,
    },
    stress: {
      onPress: onStressPress,
      buttonString: 'Log Stress',
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
  };

  const activeModules: ModuleDefinition[] = MODULES.filter(
    (module) => getActiveModules()[module.id]
  );

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

  if (!menuOpen) {
    return null;
  }

  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <AttachStep index={2} style={{ alignSelf: 'center' }}>
          <Card className="mb-6 h-auto w-3/4 justify-center shadow-block">
            <CardHeader className="w-full flex-row items-center justify-between">
              <CardTitle className="mx-2 my-4 text-2xl font-bold">{name}</CardTitle>
              {goalsViewActive ? (
                <Button onPress={submitGoals} className="py-0" variant="secondary">
                  <AppText className="font-bold text-white">Back</AppText>
                </Button>
              ) : (
                <Button onPress={() => setGoalsViewActive(!goalsViewActive)} className="py-0">
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
        </AttachStep>
      </View>
    </View>
  );
}
