import Menu from '@/components/widgets/Menu';
import { useAppContext } from '@/lib/AppContext';
import { waterBridge } from '@/lib/api/APIBridge';
import { useWater } from '@/lib/api/WaterBridge';
import ChartIcon from '@assets/icons/chart.svg';
import CheckIcon from '@assets/icons/check.svg';
import PersonIcon from '@assets/icons/person.svg';
import PlusIcon from '@assets/icons/plus.svg';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Settings from './Settings';
import Stats from './Stats';

export default function Toolbar({}: {}) {
  const water = useWater() ?? 0;
  const { statsOpen, menuOpen, settingsOpen, changeMenu, changeSettings, changeStats } =
    useAppContext();
  const [draftWater, setDraftWater] = useState(water);

  function closeMenu() {
    if (menuOpen) {
      waterBridge.setWater(draftWater);
      changeMenu();
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
      <Menu water={draftWater} setWater={setDraftWater} />
      <Settings />

      {/* The toolbar itself */}
      <View className="flex w-full flex-row justify-center gap-32 border-t-4 border-border bg-white p-1">
        <Pressable
          disabled={menuOpen || settingsOpen}
          className={`p-2 transition-opacity duration-200 ${menuOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => changeStats()}>
          <ChartIcon width={28} height={28} />
        </Pressable>

        <Pressable
          disabled={statsOpen || settingsOpen}
          className={`absolute -top-[25px] size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => closeMenu()}>
          {menuOpen && <CheckIcon width={50} height={50} color={'white'} />}

          {!menuOpen && <PlusIcon width={50} height={50} color={'white'} />}
        </Pressable>

        <Pressable
          disabled={statsOpen || menuOpen}
          className={`p-2 transition-opacity  duration-200 ${statsOpen || menuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => changeSettings()}>
          <PersonIcon width={28} height={28} />
        </Pressable>
      </View>
    </View>
  );
}
