import { Button } from '@/components/ui/button';
import Menu from '@/components/widgets/Menu';
import { PopupConfigs } from '@/lib/types';
import { useRouter } from 'expo-router';
import { ChartNoAxesCombined, Check, Plus, User } from 'lucide-react-native';
import { View } from 'react-native';
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

    const router = useRouter()
    
    const popupOpen: boolean = popup.menuOpen || popup.settingsOpen
    
    return (
        <View className='w-full mt-auto z-20'>
            <View className='left-0 right-0 items-center' >
                <View className='relative items-center w-full'>
                    <Menu isOpen={popup.menuOpen} water={water} setWater={setWater} />
                    <Settings isOpen={popup.settingsOpen} />

                    {/* The toolbar itself */}
                    <View className='w-full flex flex-row border-2 bg-slate-200 border-slate-200 p-1 justify-evenly'>
                        <Button
                        disabled={popupOpen}
                        className={`transition-opacity duration-200 ${ popupOpen ? 'opacity-0' : 'opacity-100' }`}
                        variant='outline'
                        onPress={() => router.push('/animation_test')}>
                            <ChartNoAxesCombined size={"28"} />
                        </Button>
                        
                        <Button
                        disabled={popupOpen}
                        className={`transition-opacity duration-200 ${ popupOpen ? 'opacity-0' : 'opacity-100' }`}
                        variant='outline'
                        onPress={() => router.push('/stats')}>
                            <ChartNoAxesCombined size={"28"} />
                        </Button>

                        <Button
                        disabled={popup.settingsOpen}
                        variant='outline'
                        size="icon"
                        className={`rounded-full transition-opacity duration-200 ${ popup.settingsOpen ? 'opacity-0' : 'opacity-100' }`}
                        onPress={() => popup.changeMenu()}>
                            {popup.menuOpen && (
                                <Check size={32} color={"#008000"} />
                            )}

                            {!popup.menuOpen && (
                                <Plus size={35} />
                            )}
                        </Button>

                        <Button
                        disabled={popup.menuOpen}
                        className={`transition-opacity duration-200 ${ popup.menuOpen ? 'opacity-0' : 'opacity-100' }`}
                        variant='outline'
                        onPress={() => popup.changeSettings()}>
                            <User size={28} />
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    )
}
