import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Text, View } from 'react-native'

import PopupMenu from '@/components/widgets/PopupMenu'
import * as storage from '@/lib/storage';

export default function Toolbar({ menuOpen, changeMenu } : {menuOpen : boolean, changeMenu: Function}) {
    let init_water = 10;
    const [water, setWater] = useState(init_water);


    // Send water data to storage when popupmenu is closed.
    useEffect(() => {
        if (!menuOpen) {
          console.log('saved water ' + water);
          storage.setWaterData(water);
        }
      }, [menuOpen, water]);


    return (
        <View className='w-full mt-auto'>
            {/* The blur that appears when popup menu is opened */}
            
            <View className='mt-auto left-0 right-0 items-center' >
                <View className='relative items-center w-full'>
                    <View className={`transition-opacity duration-300 ${ menuOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                        <PopupMenu isOpen={menuOpen} water={water} setWater={setWater} />
                    </View>
                    {/* The toolbar itself */}
                    <View className='flex flex-row border-2 bg-slate-200 border-slate-200 p-2 mt-auto justify-between'>
                        <Button variant='outline' className='flex-1'>
                            <Text>
                                Stats
                            </Text>
                        </Button>
                        <Button variant='outline' className='flex-1 mx-2' onPress={() => changeMenu()}>
                            <Text>
                                {!menuOpen ? 'Modules' : 'Close'}
                            </Text>
                        </Button>
                        <Button variant='outline' className='flex-1'>
                            <Text>
                                Account
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    )
}
