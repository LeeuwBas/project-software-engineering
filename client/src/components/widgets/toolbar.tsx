import Menu from '@/components/widgets/Menu';
import { PopupConfigs } from '@/lib/types';
import CheckIcon from '@assets/icons/check.svg';
import PlusIcon from '@assets/icons/plus.svg';
import PersonIcon from '@assets/icons/profile.svg';
import ChartIcon from '@assets/icons/stats.svg';
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import Settings from './Settings';

export default function Toolbar({ popup }: { popup: PopupConfigs }) {
  const popupOpen: boolean = popup.menuOpen || popup.settingsOpen;
  const router = useRouter();

  function close() {
    popup.changeMenu();
  }

  return (
    <View className="relative left-0 right-0 z-20 mt-auto w-full items-center">
      <Menu isOpen={popup.menuOpen} />
      <Settings isOpen={popup.settingsOpen} />

      {/* The toolbar itself */}
      <View className="flex w-full flex-row justify-center gap-44 border-t-4 border-border bg-white p-1">
        <Pressable
          disabled={popupOpen}
          className={`p-2 transition-opacity duration-200 ${popupOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => router.push('/stats')}>
          <ChartIcon width={28} height={28} color='#555555'/>
        </Pressable>


        <Pressable
          disabled={popup.settingsOpen}
          className={`absolute -top-[25px] size-16 items-center justify-center border-4 border-primary-dark bg-primary shadow-block transition-opacity duration-200 ${popup.settingsOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => close()}>
          {popup.menuOpen && <CheckIcon width={50} height={50} color={'white'} />}

          {!popup.menuOpen && <PlusIcon width={50} height={50} color={'white'} />}
        </Pressable>

        <Pressable
          disabled={popup.menuOpen}
          className={`p-2 transition-opacity  duration-200 ${popup.menuOpen ? 'opacity-0' : 'opacity-100'}`}
          onPress={() => popup.changeSettings()}>
          <PersonIcon width={28} height={28} color='#555555'/>
        </Pressable>
      </View>
    </View>
  );
}
