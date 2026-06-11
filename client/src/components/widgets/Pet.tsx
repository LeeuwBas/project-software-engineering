import { Image } from 'expo-image';
import { View } from 'react-native';

export default function Pet({ className = '', id, ...props }: { className?: string; id: number }) {
  function selection(id: number) {
    switch (id) {
      case 0:
        return require('@/assets/pets/onigiri.png');
      case 1:
        return require('@/assets/pets/frog.png');
      case 2:
        return require('@/assets/pets/blob.png');
      default:
        console.error('Unknown pet id');
    }
  }

  const source = selection(id);

  return (
    <View className={className} {...props}>
      <Image style={{ width: '100%', aspectRatio: 1 }} contentFit="cover" source={source} />
    </View>
  );
}
