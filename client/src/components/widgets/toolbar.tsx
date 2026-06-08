import { Button } from '@/components/ui/button';
import Menu from '@/components/widgets/Menu';
import { PopupConfigs } from '@/lib/types';
import { ChartNoAxesCombined, Check, Plus, User } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Settings from './Settings';

export default function Toolbar(
    {
        popup,
        water,
        setWater
    } : {
        popup: PopupConfigs,
        water: number,
        setWater: {(value: number): void}
    }) {

    const popupOpen: boolean = popup.menuOpen || popup.settingsOpen

    return (
        <View className='relative w-full mt-auto z-20 left-0 right-0 items-center'>
            <Menu isOpen={popup.menuOpen} water={water} setWater={setWater} />
            <Settings isOpen={popup.settingsOpen} />

            {/* The toolbar itself */}
            <View className='w-full flex flex-row border-2 bg-slate-200 border-slate-200 p-1 gap-32 justify-center'>
                <Pressable
                disabled={popupOpen}
                className={`p-2 transition-opacity duration-200 ${ popupOpen ? 'opacity-0' : 'opacity-100' }`}>
                    <ChartNoAxesCombined size={"28"} />
                </Pressable>

                <Pressable
                disabled={popup.settingsOpen}
                className={`absolute justify-center items-center bg-[#f67788] shadow-black shadow-lg -top-[25px] size-16 rounded-full transition-opacity duration-200 ${ popup.settingsOpen ? 'opacity-0' : 'opacity-100' }`}
                onPress={() => popup.changeMenu()}>
                    {popup.menuOpen && (
                        <Check size={32} color={"#c1d568"} />
                    )}

                    {!popup.menuOpen && (
                        <Plus size={50} color={"white"} />
                    )}
                </Pressable>

                <Pressable
                disabled={popup.menuOpen}
                className={`transition-opacity p-2 bg-slate-200  duration-200 ${ popup.menuOpen ? 'opacity-0' : 'opacity-100' }`}
                onPress={() => popup.changeSettings()}>
                    <User size={28} />
                </Pressable>
            </View>
        </View>
    )
}
