import { Button } from '@/components/ui/button'
import { Text, View } from 'react-native'

export default function Toolbar(
    {
        setMenuOpen,
        menuOpen
    }: {
        setMenuOpen: Function
        menuOpen: boolean
    }) {
    return (
        <View className='flex flex-row border-2 bg-slate-200 border-slate-200 p-2 mt-auto justify-between'>
            <Button variant='outline' className='flex-1'>
                <Text>
                    Stats
                </Text>
            </Button>
            <Button variant='outline' className='flex-1 mx-2' onPress={() => setMenuOpen()}>
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
    )
}
