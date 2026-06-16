import Menu from '@/components/widgets/Menu';
import { useAppContext } from '@/lib/AppContext';
import { waterBridge } from '@/lib/api/APIBridge';
import { useWater } from '@/lib/api/WaterBridge';
import CheckIcon from '@assets/icons/toolbar_icons/check.svg';
import PlusIcon from '@assets/icons/toolbar_icons/plus.svg';
import ProfileIcon from '@assets/icons/toolbar_icons/profile.svg';
import StatsIcon from '@assets/icons/toolbar_icons/stats.svg';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Settings from './Settings';
import Stats from './Stats';
import StressMenu from './StressMenu';

export default function Toolbar({}: {}) {
  const water = useWater() ?? 0;
  const { statsOpen, menuOpen, settingsOpen, changeMenu, changeSettings, changeStats, stressMenuOpen, changeStressMenu,
    sendStress } = useAppContext();
  const [draftWater, setDraftWater] = useState(water);

  function closeMenu() {
    if (menuOpen || stressMenuOpen) {
      waterBridge.set(draftWater);
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
    }
  }, [menuOpen, water]);

  return (
    <View className="relative left-0 right-0 z-20 mt-auto w-full items-center">
      <Stats />
      <StressMenu/>
      <Menu water={draftWater} setWater={setDraftWater} onStressPress={() => { changeStressMenu(); changeMenu(); }} />
      <Settings />

      {/* The toolbar itself */}
      <View className="flex w-full flex-row justify-center gap-44 border-t-4 border-border bg-white p-1">
        <Pressable
          disabled={menuOpen || settingsOpen || stressMenuOpen}
          className={`p-2 transition-opacity duration-200 ${menuOpen || settingsOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => changeStats()}>
          <StatsIcon width={28} height={28} color="#555555" />
        </Pressable>

        <Pressable
          disabled={statsOpen || settingsOpen}
          className={`absolute -top-[25px] size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => {
            if (stressMenuOpen) {
              sendStress 
            }
            closeMenu()
          }}>

          {(menuOpen || stressMenuOpen) && <CheckIcon width={50} height={50} color={'white'} />}

          {(!menuOpen && !stressMenuOpen) && <PlusIcon width={50} height={50} color={'white'} />}
        </Pressable>

        <Pressable
          disabled={statsOpen || menuOpen || stressMenuOpen}
          className={`p-2 transition-opacity  duration-200 ${statsOpen || menuOpen || stressMenuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => changeSettings()}>
          <ProfileIcon width={28} height={28} color="#555555" />
        </Pressable>
      </View>
    </View>
  );
}
