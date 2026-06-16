import { AppText } from '@/components/AppText';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { TextInput, View } from 'react-native';

export default function GoalsView({
  goals,
  setGoals,
}: {
  goals: { water: number; steps: number };
  setGoals: Function;
}) {
  return (
    <View>
      <AppText className="text-lg font-bold">Goals:</AppText>
      <View className="flex flex-row items-center gap-2 p-2">
        <Glass height={30} width={30} />
        <TextInput
          keyboardType="numeric"
          inputMode="numeric"
          className="rounded-xl border-2 bg-slate-300 px-2 py-1 text-right"
          value={goals.water.toString()}
          onChangeText={(text) => {
            if (Number(text) > 99) text = '99';
            if (text.length > 10) return;
            setGoals((prev) => ({
              ...prev,
              water: text,
            }));
          }}
          onBlur={() =>
            setGoals((prev) => ({
              ...prev,
              water: Math.ceil(prev.water),
            }))
          }
        />
      </View>
      <View className="flex flex-row items-center gap-2 p-2">
        <Shoe height={30} width={30} />
        <TextInput
          keyboardType="numeric"
          inputMode="numeric"
          className="rounded-xl border-2 bg-slate-300 px-2 py-1 text-right"
          value={goals.steps.toString()}
          onChangeText={(text) => {
            if (Number(text) > 99999) text = '99999';
            if (text.length > 10) return;
            setGoals((prev) => ({
              ...prev,
              steps: text,
            }));
          }}
          onBlur={() =>
            setGoals((prev) => ({
              ...prev,
              steps: Math.ceil(prev.steps),
            }))
          }
        />
      </View>
    </View>
  );
}
