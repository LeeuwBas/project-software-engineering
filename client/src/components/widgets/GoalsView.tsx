import { AppText } from '@/components/AppText';
import { GoalModules } from '@/lib/types';
import Food from '@assets/icons/module_icons/food.svg';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { TextInput, View } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface GoalInput {
  id: string;
  icon: React.FC<SvgProps>;
  maxValue: number;
}

const GOALS: GoalInput[] = [
  { id: 'water', icon: Glass, maxValue: 99 },
  { id: 'steps', icon: Shoe, maxValue: 99999 },
  { id: 'food', icon: Food, maxValue: 9 },
];

/** TODO (Dorus-vda): docstring */
export default function GoalsView({ goals, setGoals }: { goals: GoalModules; setGoals: Function }) {
  return (
    <View className="flex-col gap-2">
      <AppText className="text-lg font-bold">Goals:</AppText>
      {GOALS.map(({ id, icon: Icon, maxValue }) => (
        <View className="flex flex-row items-center gap-2" key={id}>
          <Icon height={30} width={30} />
          <TextInput
            keyboardType="numeric"
            inputMode="numeric"
            className="w-20 rounded-xl border-2 bg-slate-300 px-2 py-1 text-right"
            value={String(goals[id as keyof GoalModules])}
            maxLength={maxValue.toString().length + 1}
            // On each key stroke, limit value
            onChangeText={(text) => {
              if (Number(text) > maxValue) text = String(maxValue);
              setGoals((prev: GoalModules) => ({
                ...prev,
                [id]: text,
              }));
            }}
            // On exit keyboard
            onBlur={() =>
              setGoals((prev: GoalModules) => ({
                ...prev,
                [id]: Math.ceil(Number(prev[id as keyof GoalModules])),
              }))
            }
          />
        </View>
      ))}
    </View>
  );
}
