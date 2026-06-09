import Menu from '@/components/widgets/Menu';
import { PopupConfigs } from '@/lib/types';
import { useRouter } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import ChartIcon from '@assets/icons/chart.svg';
import PersonIcon from '@assets/icons/person.svg';
import PlusIcon from '@assets/icons/plus_square.svg';
import CheckIcon from '@assets/icons/check_square.svg';
import { Pressable, View } from 'react-native';
import Settings from './Settings';

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
  const popupOpen: boolean = popup.menuOpen || popup.settingsOpen;
  const router = useRouter();

  function close() {
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
      <Menu isOpen={popup.menuOpen} water={draftWater} setWater={setDraftWater} />
      <Settings isOpen={popup.settingsOpen} />

      {/* The toolbar itself */}
      <View className="flex w-full flex-row justify-center gap-32 border-2 border-[#856a54] bg-[#9a806c] p-1">
        <Pressable
          disabled={popupOpen}
          className={`p-2 transition-opacity duration-200 ${popupOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => router.push('/stats')}>
          <ChartIcon width={28} height={28} color={'#ffffff'} />
        </Pressable>

        <Pressable
          disabled={popup.settingsOpen}
          className={`absolute -top-[25px] size-16 items-center justify-center bg-[#74c6b6] shadow-lg shadow-black transition-opacity duration-200 ${popup.settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => close()}>
          {popup.menuOpen && <CheckIcon width={50} height={50} color={'white'} />}

          {!popup.menuOpen && <PlusIcon width={50} height={50} color={'white'} />}
        </Pressable>

        <Pressable
          disabled={popup.menuOpen}
          className={`p-2 transition-opacity  duration-200 ${popup.menuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => popup.changeSettings()}>
          <PersonIcon width={28} height={28} color={'#ffffff'} />
        </Pressable>
      </View>
    </View>
  );
}
