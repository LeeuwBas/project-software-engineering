import { GlassWater } from 'lucide-react-native';
import { View } from 'react-native';

export default function Statbar({ stat, value }: { stat: string; value: number }) {
  let bgColor: string | null = null;
  switch (stat) {
    case 'none':
      break;
    case 'water':
      bgColor = '#74ccf4aa';
      break;
    default:
      console.error('Unknown stat');
  }

  if (!bgColor) {
    return;
  }

  return (
    bgColor && (
      <View className="my-auto h-1/2 w-full">
        <GlassWater size={20} className="mb-2 text-foreground" />
        <View className="my-auto flex-auto border-4 border-border-dark bg-transparent dark:border-border">
          <View
            className="mt-auto"
            style={{
              height: `${Math.min(Math.max(value, 0), 8) * 12.5}%`,
              backgroundColor: bgColor,
            }}
          />
        </View>
      </View>
    )
  );
}
