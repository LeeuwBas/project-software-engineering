import Menu from '@/components/widgets/Menu';
import { useAppContext } from '@/lib/AppContext';
import {
  foodBridge,
  sleepBridge,
  stepsBridge,
  stressBridge,
  waterBridge,
} from '@/lib/api/APIBridge';
import { GoaledModule, MODULES } from '@/lib/types';
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
import { NotchedBorder } from '../ui/notched-border';
import { NotchedBox } from '../ui/notched-box';

export default function Toolbar({}: {}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const moduleValues: Record<string, number> = Object.fromEntries(
    MODULES.map((module) => [module.id, module.useValue() ?? 0])
  );

  const goaledModules: GoaledModule[] = MODULES.filter(
    (module): module is GoaledModule => 'goalConfig' in module
  );

  const goals: Record<string, number> = Object.fromEntries(
    goaledModules.map((module) => [module.id, module.bridge.useGoal() ?? 0])
  );

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

  const [draftWater, setDraftWater] = useState(moduleValues.water);
  const [draftFood, setDraftFood] = useState(moduleValues.food);
  const [draftSleep, setDraftSleep] = useState(moduleValues.sleep);
  const [draftGoals, setDraftGoals] = useState<Record<string, number>>(goals);

  async function closeMenu() {
    if (menuOpen || stressMenuOpen) {
      (await waterBridge.set(draftWater),
        await foodBridge.set(draftFood),
        await sleepBridge.set(draftSleep));

      // await Promise.allSettled([

      // await goaledModules.map(async (module) => {
      //     await module.bridge.setGoal(draftGoals[module.id]);
      //     console.log('Save ' + module.id + ' goal: ' + draftGoals[module.id]);
      // });

      await foodBridge.setGoal(draftGoals['food']);
      await stepsBridge.setGoal(draftGoals['steps']);
      await waterBridge.setGoal(draftGoals['water']);
      // ]);

      if (menuOpen) changeMenu();
      if (stressMenuOpen) changeStressMenu();
    } else {
      changeMenu();
    }
  }

  // Refresh value in popup when retrieved from storage
  useEffect(() => {
    if (menuOpen) {
      setDraftWater(moduleValues.water);
      setDraftFood(moduleValues.food);
      setDraftSleep(moduleValues.sleep);
      setDraftGoals(goals);
    }
  }, [menuOpen]);

  return (
    <View className="relative left-0 right-0 z-20 mt-auto w-full items-center">
      <Stats />
      <StressMenu />
      <Menu
        water={draftWater}
        setWater={setDraftWater}
        steps={moduleValues.steps} // Steps doesn't need a draft because it is not changed in the menu.
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

      {/* The toolbar itself */}
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
            <NotchedBox
              className={`shadow-block transition-opacity duration-200 ${
                statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'
              }`}
              fillClassName="bg-primary"
              borderClassName="bg-primary-dark">
              <Pressable
                disabled={statsOpen || settingsOpen}
                className={`size-16 items-center justify-center`}
                onPress={() => {
                  if (stressMenuOpen) {
                    sendStress();
                  }
                  closeMenu();
                }}>
                {(menuOpen || stressMenuOpen) && (
                  <CheckIcon width={50} height={50} color={'white'} />
                )}

                {!menuOpen && !stressMenuOpen && (
                  <PlusIcon width={50} height={50} color={'white'} />
                )}
              </Pressable>
            </NotchedBox>
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
