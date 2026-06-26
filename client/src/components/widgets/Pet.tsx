import Blob from '@assets/pets/blob/blob.svg';
import Bober from '@assets/pets/bober/BOBER.svg';
import Frog from '@assets/pets/frog/frog.svg';
import Onigiri from '@assets/pets/onigiri/onigiri.svg';
import Chickie from '@assets/pets/chickie/chickie.svg';
import { View } from 'react-native';

/**
 * View containing the pet sprite
 *
 * @param className className in pet view
 * @param id id of the pet
 * @param props props in pet view
 */
export default function Pet({ className = '', id, ...props }: { className?: string; id: number }) {
  function selection(id: number) {
    switch (id) {
      case 0:
        return <Frog width={'100%'} height={200} />;
      case 1:
        return <Onigiri width={'100%'} height={200} />;
      case 2:
        return <Blob width={'100%'} height={200} />;
      case 3:
        return <Bober width={'100%'} height={200} />;
      case 4:
        return <Chickie width={'100%'} height={200} />;
      default:
        console.error('Unknown pet id: ' + id);
    }
  }

  return (
    <View className={className} {...props}>
      {selection(id)}
    </View>
  );
}
