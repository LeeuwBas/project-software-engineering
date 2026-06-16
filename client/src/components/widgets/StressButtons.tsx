import { Pressable, View } from 'react-native';

const COLORS = ['#b41b21', '#df9732', '#e1d60b', '#7eaf1c', '#22a022'];
const FADED_COLORS = ['#ff9699', '#ffd69c', '#fff7a1', '#b9d580', '#81c381'];

interface StressButtonsProps {
  value: number | null;
  onChange: (value: number) => void;
}

export default function StressButtons({ value, onChange }: StressButtonsProps) {
  const selectedIndex = value ? value - 1 : null;

  return (
    <View className="m-4 flex-row self-center">
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
  );
}