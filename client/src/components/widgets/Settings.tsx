import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

export default function Settings(
  {
    isOpen
  }: {
    isOpen: boolean
  }) {

  if (!isOpen) {
    return
  }

  const router = useRouter()

  type SettingItem = {
    label: string;
    effect: (() => void) | null
  };

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet', effect: () => router.push('/pet-select')},
    { label: 'Change Username', effect: null },
    { label: 'More', effect: null },
  ];

  return (
    <View className={`transition-opacity duration-200 ${ isOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
      <View className='absolute bottom-full mb-2 items-center w-full'>
          <View className="w-3/4 p-2 h-auto bg-grey justify-center items-center bg-white rounded-3xl shadow-sm">
              {ITEMS.map((item) => (
                <Button
                  className='my-2'
                  key={item.label}
                  variant="default"
                  onPress={item.effect}>
                  <Text>{item.label}</Text>
                </Button>
              ))}
          </View>
      </View>
    </View>
  )
}
