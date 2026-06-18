import Menu from '@/components/widgets/Menu';
import { useAppContext } from '@/lib/AppContext';
import { stepsBridge, waterBridge } from '@/lib/api/APIBridge';
import { useWater } from '@/lib/api/WaterBridge';
import { Modules } from '@/lib/types';
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

export default function Toolbar({}: {}) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#f2f2f2' : '#555555';

  const water = useWater() ?? 0;
  const goals: Modules = {
    water: waterBridge.useGoal() ?? 0,
    steps: stepsBridge.useGoal() ?? 0,
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
  const [draftGoals, setDraftGoals] = useState<Modules>(goals);
  const steps = 6000;

  function closeMenu() {
    if (menuOpen || stressMenuOpen) {
      console.log('Save water goal: ' + draftGoals.water);
      waterBridge.set(draftWater);
      waterBridge.setGoal(draftGoals.water);
      stepsBridge.setGoal(draftGoals.steps);

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
