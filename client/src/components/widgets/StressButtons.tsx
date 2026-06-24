import { Pressable, View } from 'react-native';
import { AppText } from '../AppText';

const COLORS = ['#22a022', '#7eaf1c', '#e1d60b', '#df9732', '#b41b21'];
const FADED_COLORS = ['#81c381', '#b9d580', '#fff7a1', '#ffd69c', '#ff9699'];

interface StressButtonsProps {
  value: number | null;
  onChange: (value: number) => void;
}

/** TODO (hfgieter): docstring */
export default function StressButtons({ value, onChange }: StressButtonsProps) {
  const selectedIndex = value ? value - 1 : null;

  return (
    <View className="m-0">
      <View className="mx-4 mb-1 mt-4 flex-row self-center">
        {COLORS.map((color, i) => (
          <Pressable
            key={i}
            onPress={() => onChange(i + 1)}
            className={[
              'size-10',
              i === 0 ? 'border-y-4 border-l-4 border-r-0' : '',
              i === 1 ? 'border-x-0 border-y-4' : '',
              i === 2 ? 'border-x-0 border-y-4' : '',
              i === 3 ? 'border-x-0 border-y-4' : '',
              i === 4 ? 'border-y-4 border-l-0 border-r-4' : '',
            ].join(' ')}
            style={{
              backgroundColor: selectedIndex === i ? color : FADED_COLORS[i],
              borderColor: selectedIndex === i ? FADED_COLORS[i] : color,
            }}
          />
        ))}
      </View>
      <View className="flex-row justify-between">
        <AppText className="font-bold">Disagree</AppText>
        <AppText className="font-bold">Agree</AppText>
      </View>
    </View>
  );
}
