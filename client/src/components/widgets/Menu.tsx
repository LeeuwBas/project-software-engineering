import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoalsView from '@/components/widgets/GoalsView';
import Module from '@/components/widgets/Module';
import { useAppContext } from '@/lib/AppContext';
import { ModuleProps, GoalModules } from '@/lib/types';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';
import Food from '@assets/icons/module_icons/food.svg';
import Sleep from '@assets/icons/module_icons/sleep_bed.svg';

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
  goals: GoalModules;
  setGoals: (goals: GoalModules) => void;
}) {
  const [goalsViewActive, setGoalsViewActive] = useState(false);
  // TODO: Add backend for retrieving name
  const name = 'Alex';
  const { menuOpen } = useAppContext();

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
    {
      id: 'food',
      icon: Food,
      value: food,
      setValue: setFood,
      goal: goals.food,
    },
    {
      id: 'sleep',
      icon: Sleep,
      value: sleep,
      setValue: setSleep,
    }
  ];

  useEffect(() => {
    if (!menuOpen) {
      setGoalsViewActive(false);
    }
  }, [menuOpen]);

  // Save input goals to goals view
  // Doesn't send to storage
  function submitGoals() {
    const final_goals = {
      water: Math.ceil(goals.water),
      steps: Math.ceil(goals.steps),
      food: Math.ceil(goals.food),
      sleep: false
    };
    setGoals(final_goals);
    if (water > goals.water) {
      setWater(goals.water);
    }
    setGoalsViewActive(false);
  }

  // Makes performance worse

  // if (!menuOpen) {
  //   return null;
  // }

  return (
    <View
      pointerEvents={menuOpen ? 'auto' : 'none'}
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
                  {modules.map((module) => (
                    <Module key={module.id} props={module} />
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
