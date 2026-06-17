import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoalsView from '@/components/widgets/GoalsView';
import Module from '@/components/widgets/Module';
import { useAppContext } from '@/lib/AppContext';
import { ModuleProps, Modules } from '@/lib/types';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function Menu({
  water,
  setWater,
  onStressPress,
}: {
  water: number;
  setWater: (water: number) => void;
  onStressPress: () => void;
}) {
  const [goalsViewActive, setGoalsViewActive] = useState(false);
  // TODO: Add backend for retrieving name
  const name = 'Alex';
  const { menuOpen } = useAppContext();

  // TODO: Get goals from API
  const [goals, setGoals] = useState<Modules>({ water: 10, steps: 7000 });
  const steps = 6000;

  const modules: ModuleProps[] = [
    {
      id: 'water',
      icon: Glass,
      value: water,
      setValue: setWater,
      goal: goals.water,
    },
    {
      id: 'steps',
      icon: Shoe,
      value: steps,
      goal: goals.steps,
    },
    {
      id: 'stress',
      icon: Stress,
      onPress: onStressPress,
      buttonString: 'Log Stress',
    },
  ];

  useEffect(() => {
    if (!menuOpen) {
      setGoalsViewActive(false);
    }
  }, [menuOpen]);

  function submitGoals() {
    console.log(goals);
    const final_goals = {
      water: Math.ceil(goals.water),
      steps: Math.ceil(goals.steps),
    };
    setGoals(final_goals);
    // TODO: Save final goals to storage
    setGoalsViewActive(false);
  }

  if (!menuOpen) {
    return null;
  }

  return (
    <View
      className={`absolute -top-6 w-full transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'} items-center`}>
      <View className="absolute bottom-full w-full items-center">
        <Card className="mb-6 h-auto w-3/4 items-center justify-center shadow-block">
          <CardHeader className="w-full flex-1 flex-row items-center justify-between">
            <CardTitle className="mx-2 my-4 text-2xl font-bold">{name}</CardTitle>
            {goalsViewActive ? (
              <Button onPress={submitGoals} className="py-0" variant="secondary">
                <AppText className="font-bold text-white">Save changes</AppText>
              </Button>
            ) : (
              <Button onPress={() => setGoalsViewActive(!goalsViewActive)} className="py-0">
                <AppText className="font-bold text-white">Change goals</AppText>
              </Button>
            )}
          </CardHeader>
          <CardContent className="w-full max-w-full items-start">
            {goalsViewActive ? (
              <GoalsView goals={goals} setGoals={setGoals} />
            ) : (
              <View className="flex-col gap-5">
                {modules.map((module) => (
                  <Module key={module.id} props={module} />
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
