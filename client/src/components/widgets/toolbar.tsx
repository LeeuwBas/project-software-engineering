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
import { AttachStep } from 'react-native-spotlight-tour';

export default function Toolbar({}: {}) {
  const water = useWater() ?? 0;
  const { statsOpen, menuOpen, settingsOpen, changeMenu, changeSettings, changeStats } =
    useAppContext();
  const [draftWater, setDraftWater] = useState(water);

  function closeMenu() {
    if (menuOpen) {
      waterBridge.set(draftWater);
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
      <View className="flex w-full flex-row justify-center gap-44 border-t-4 border-border bg-white p-1">
        {/* Stats button — highlighted to open (index 5) and again to close (index 7) */}
        <AttachStep index={5}>
          <AttachStep index={7}>
            <Pressable
              disabled={menuOpen || settingsOpen}
              className={`p-2 transition-opacity duration-200 ${menuOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
              onPress={() => changeStats()}>
              <StatsIcon width={28} height={28} color="#555555" />
            </Pressable>
          </AttachStep>
        </AttachStep>

        {/* Center button — highlighted to open the menu (index 1) and again to close it (index 4) */}
        <AttachStep index={1} style={{ position: 'absolute', top: -25 }}>
          <AttachStep index={4}>
            <Pressable
              disabled={statsOpen || settingsOpen}
              className={`size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${statsOpen || settingsOpen ? 'opacity-0' : 'opacity-100'}`}
              onPress={() => closeMenu()}>
              {menuOpen && <CheckIcon width={50} height={50} color={'white'} />}

              {!menuOpen && <PlusIcon width={50} height={50} color={'white'} />}
            </Pressable>
          </AttachStep>
        </AttachStep>

        {/* Profile button — highlighted (index 8), no interaction required */}
        <AttachStep index={8}>
          <Pressable
            disabled={statsOpen || menuOpen}
            className={`p-2 transition-opacity  duration-200 ${statsOpen || menuOpen ? 'opacity-0' : 'opacity-100'}`}
            onPress={() => changeSettings()}>
            <ProfileIcon width={28} height={28} color="#555555" />
          </Pressable>
        </AttachStep>
      </View>
    </View>
  );
}
