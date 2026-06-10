import Menu from '@/components/widgets/Menu';
import { PopupConfigs } from '@/lib/types';
import ChartIcon from '@assets/icons/chart.svg';
import CheckIcon from '@assets/icons/check.svg';
import PersonIcon from '@assets/icons/person.svg';
import PlusIcon from '@assets/icons/plus.svg';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Settings from './Settings';
import Stats from './Stats';

export default function Toolbar({
  popup,
  water,
  saveWater,
}: {
  popup: PopupConfigs;
  water: number;
  saveWater: Function;
}) {
  const [draftWater, setDraftWater] = useState(water);

  function closeMenu() {
    if (popup.menuOpen) {
      saveWater(draftWater);
      popup.changeMenu();
    } else {
      popup.changeMenu();
    }
  }

  // Refresh value in popup when retrieved from storage
  useEffect(() => {
    if (popup.menuOpen) {
      setDraftWater(water);
    }
  }, [popup.menuOpen, water]);

  return (
    <View className="relative left-0 right-0 z-20 mt-auto w-full items-center">
      <Stats isOpen={popup.statsOpen} />
      <Menu isOpen={popup.menuOpen} water={draftWater} setWater={setDraftWater} />
      <Settings isOpen={popup.settingsOpen} />

      {/* The toolbar itself */}
      <View className="flex w-full flex-row justify-center gap-32 border-t-4 border-border bg-white p-1">
        <Pressable
          disabled={popup.menuOpen || popup.settingsOpen}
          className={`p-2 transition-opacity duration-200 ${popup.menuOpen || popup.settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => popup.changeStats()}>
          <ChartIcon width={28} height={28} />
        </Pressable>

        <Pressable
          disabled={popup.statsOpen || popup.settingsOpen}
          className={`absolute -top-[25px] size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${popup.statsOpen || popup.settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => closeMenu()}>
          {popup.menuOpen && <CheckIcon width={50} height={50} color={'white'} />}

          {!popup.menuOpen && <PlusIcon width={50} height={50} color={'white'} />}
        </Pressable>

        <Pressable
          disabled={popup.statsOpen || popup.menuOpen}
          className={`p-2 transition-opacity  duration-200 ${popup.statsOpen || popup.menuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => popup.changeSettings()}>
          <PersonIcon width={28} height={28} />
        </Pressable>
      </View>
    </View>
  );
}
