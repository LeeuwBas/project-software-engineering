import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { NotchedBox } from '../ui/notched-box';

export default function Bar({
  icon: Icon,
  value,
  goal,
}: {
  icon: React.FC<SvgProps>;
  value: number;
  goal: number;
}) {
  return (
    <View className="w-1/2">
      <View className="flex-row justify-center gap-1">
        <Icon />
        <NotchedBox
          fillClassName="bg-background"
          borderClassName="bg-border-dark"
          className="flex-1">
          <View className="absolute inset-1 flex-row overflow-hidden">
            <View
              className="mt-auto h-full"
              style={{
                width: `${(Math.min(Math.max(value, 0), goal) * 100) / goal}%`,
                backgroundColor: '#74ccf4aa',
              }}
            />
          </View>
        </NotchedBox>
      </View>
    </View>
  );
}
