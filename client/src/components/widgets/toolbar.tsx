import Menu from '@/components/widgets/Menu';
import { useAppContext } from '@/lib/AppContext';
import { foodBridge, sleepBridge, stepsBridge, waterBridge } from '@/lib/api/APIBridge';
import { useFood } from '@/lib/api/FoodBridge';
import { useSleep } from '@/lib/api/SleepBridge';
import { useWater } from '@/lib/api/WaterBridge';
import { GoalModules } from '@/lib/types';
import CheckIcon from '@assets/icons/toolbar_icons/check.svg';
import PlusIcon from '@assets/icons/toolbar_icons/plus.svg';
import ProfileIcon from '@assets/icons/toolbar_icons/profile.svg';
import StatsIcon from '@assets/icons/toolbar_icons/stats.svg';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { AttachStep } from 'react-native-spotlight-tour';
import Settings from './Settings';
import Stats from './Stats';
import StressMenu from './StressMenu';

/** TODO (ZJWeng, Dorus-vda, buenk): docstring */
export default function Toolbar({}: {}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const water = useWater() ?? 0;
  const food = useFood() ?? 0;
  // const steps = useSteps() ?? 0; TODO (Dorus-vda): please add more comments to explain sections, also remove this if it's unused
  const steps = 6000;
  const sleep = useSleep() ?? 0;

  const goals: GoalModules = {
    water: waterBridge.useGoal() ?? 0,
    steps: stepsBridge.useGoal() ?? 0,
    food: foodBridge.useGoal() ?? 0,
  };

  const {
    statsOpen,
    menuOpen,
    settingsOpen,
    changeMenu,
    changeSettings,
    changeStats,
    stressMenuOpen,
    changeStressMenu,
    sendStress,
  } = useAppContext();

  const [draftWater, setDraftWater] = useState(water);
  const [draftFood, setDraftFood] = useState(food);
  const [draftSleep, setDraftSleep] = useState(sleep);
  const [draftGoals, setDraftGoals] = useState<GoalModules>(goals);

  async function closeMenu() {
    if (menuOpen || stressMenuOpen) {
      await waterBridge.set(draftWater);
      await foodBridge.set(draftFood);
      await sleepBridge.set(draftSleep);

      await waterBridge.setGoal(draftGoals.water).then(() => stepsBridge.setGoal(draftGoals.steps));
      await foodBridge.setGoal(draftGoals.food);
      console.log('Save water goal: ' + draftGoals.water);
      console.log('Save steps goal: ' + draftGoals.steps);
      console.log('Save food goal: ' + draftGoals.food);

      if (menuOpen) changeMenu();
      if (stressMenuOpen) changeStressMenu();
    } else {
      changeMenu();
    }
  }

  // Refresh value in popup when retrieved from storage
  useEffect(() => {
    if (menuOpen) {
      setDraftWater(water);
      setDraftFood(food);
      setDraftSleep(sleep);
      setDraftGoals(goals);
    }
  }, [menuOpen, water]);

  return (
    <View className="relative left-0 right-0 z-20 mt-auto w-full items-center">
      <Stats />
      <StressMenu />
      <Menu
        water={draftWater}
        setWater={setDraftWater}
        steps={steps}
        onStressPress={() => {
          changeStressMenu();
          changeMenu();
        }}
        food={draftFood}
        setFood={setDraftFood}
        sleep={draftSleep}
        setSleep={setDraftSleep}
        goals={draftGoals}
        setGoals={setDraftGoals}
      />
      <Settings />

      {/* The toolbar itself TODO: (ZJWeng): add more comments explaing the structure, above and below this plz */}
      <View className="flex w-full flex-row justify-center gap-44 border-t-4 border-border bg-card p-1">
        <AttachStep index={5}>
          <AttachStep index={7}>
            <Pressable
              disabled={menuOpen || settingsOpen || stressMenuOpen}
              className={`p-2 transition-opacity duration-200 ${menuOpen || settingsOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              onPress={() => changeStats()}>
              <StatsIcon width={28} height={28} color={iconColor} />
            </Pressable>
          </AttachStep>
        </AttachStep>

        <AttachStep index={1} style={{ position: 'absolute', top: -25 }}>
          <AttachStep index={4}>
            <Pressable
              disabled={statsOpen || settingsOpen}
              className={`size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
              onPress={() => {
                if (stressMenuOpen) {
                  sendStress();
                }
                closeMenu();
              }}>
              {(menuOpen || stressMenuOpen) && <CheckIcon width={50} height={50} color={'white'} />}

              {!menuOpen && !stressMenuOpen && <PlusIcon width={50} height={50} color={'white'} />}
            </Pressable>
          </AttachStep>
        </AttachStep>

        <AttachStep index={8}>
          <Pressable
            disabled={statsOpen || menuOpen || stressMenuOpen}
            className={`p-2 transition-opacity  duration-200 ${statsOpen || menuOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            onPress={() => changeSettings()}>
            <ProfileIcon width={28} height={28} color={iconColor} />
          </Pressable>
        </AttachStep>
      </View>
    </View>
  );
}
