import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthSwitchNoLoading, useSignOutAndRouteTo } from '@/lib/auth/AuthManager';
import { View } from 'react-native';

export default function Settings(
  {
    isOpen
  }: {
    isOpen: boolean
  }) {

  if (!isOpen) {
    return
  }

  const authSwitchNL = useAuthSwitchNoLoading()
  const signOutGo = useSignOutAndRouteTo()

  type SettingItem = {
    label: string
    effect: Function | null
  };

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: null },
    { label: 'Change Username', effect: null },
    { label: 'More', effect: null },
    authSwitchNL(
      { label: 'Sign out', effect: () => {signOutGo();}},
      { label: 'Sign in', effect: () => {signOutGo();}}
    )

  ];

  return (
    <View className={`-top-6 transition-opacity duration-200 ${ isOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
      <View className='absolute bottom-full mb-2 items-center w-full'>
        <Card>
          <CardContent>
            {ITEMS.map((item) => (
              <Button
                className='my-2 h-12 flex'
                key={item.label}
                variant="secondary"
                onPress={() => {item.effect?.();}}>
                <AppText className='text-white font-bold'>{item.label}</AppText>
              </Button>
            ))}
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
