import { Button } from '@/components/ui/button'
import { useRouter } from 'expo-router'
import { ChartNoAxesCombined, Check, Plus, User } from 'lucide-react-native'
import { useState } from 'react'
import { View } from 'react-native'

import PopupMenu from '@/components/widgets/PopupMenu'

export default function Toolbar(
    {
        menuOpen,
        changeMenu
    } : {
        menuOpen : boolean,
        changeMenu: Function}
    ) {

    const router = useRouter()

    let init_water = 10;
    const [water, setWater] = useState(init_water);

    return (
        <View className='w-full'>
            <View className='left-0 right-0 items-center' >
                <View className='relative items-center w-full'>
                    <View className={`transition-opacity duration-200 ${ menuOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                        <PopupMenu isOpen={menuOpen} water={water} setWater={setWater} />
                    </View>
                    {/* The toolbar itself */}
                    <View className='w-full flex flex-row border-2 bg-slate-200 border-slate-200 p-1 justify-evenly'>
                        <Button variant='outline' className={`transition-opacity duration-200 ${ menuOpen ? 'opacity-0' : 'opacity-100' }`}>
                            <ChartNoAxesCombined size={"28"} />
                        </Button>
                        <Button variant='outline' size="icon" className='rounded-full' onPress={() => changeMenu()}>
                            {menuOpen && (
                                <Check size={32} color={"#008000"}>

                                </Check>
                            )}

                            {!menuOpen && (
                                <Plus size={35}>

                                </Plus>
                            )}
                        </Button>
                        <Button
                        className={`transition-opacity duration-200 ${ menuOpen ? 'opacity-0' : 'opacity-100' }`}
                        variant='outline'
                        onPress={() => router.push('/login')}>
                            <User size={28} />
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    )
}
