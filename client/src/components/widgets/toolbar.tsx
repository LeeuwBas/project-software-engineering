import { Text, View } from 'react-native'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

export default function Toolbar() {
    return (
        <View className='flex flex-row border-2 border-slate-200 p-2 m-1 rounded-md mt-auto justify-between'>
            <Button variant='outline' className='flex-1'>
                <Text>
                    Stats
                </Text>
            </Button>
            <Button variant='outline' className='flex-1 mx-2'>
                <Text>
                    Modules
                </Text>
            </Button>
            <Button variant='outline' className='flex-1'>
                <Text>
                    Account
                </Text>
            </Button>
        </View>
    )
}
