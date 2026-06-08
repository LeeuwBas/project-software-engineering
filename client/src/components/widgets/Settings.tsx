import { Button } from '@/components/ui/button';
import { useState } from 'react';
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
    type SettingItem = {
    label: string;
  };

  const ITEMS: SettingItem[] = [
    { label: 'Change Pet' },
    { label: 'Change Username' },
    { label: 'More' },
  ];

  const [activeItem, setActiveItem] = useState<SettingItem | null>(null);

  return (
    <View className={`-top-6 transition-opacity duration-200 ${ isOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
      <View className='absolute bottom-full mb-2 items-center w-full'>
          <View className="w-3/4 p-2 h-auto bg-grey justify-center items-center bg-white rounded-3xl shadow-sm">
              {ITEMS.map((item) => (
                <Button
                  className='my-2'
                  key={item.label}
                  variant="default"
                  onPress={() => setActiveItem(item)}>
                  <Text>{item.label}</Text>
                </Button>
              ))}
          </View>
      </View>
    </View>
  )
}
