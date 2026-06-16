import { AppText } from '@/components/AppText';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import { TextInput, View } from 'react-native';

export default function GoalsView() {
  // TODO: Get goals from API
  const goals = { water: 10, steps: 7000 };

  return (
    <View>
      <AppText className="text-lg font-bold">Goals:</AppText>
      <View className="flex flex-row items-center gap-2 p-2">
        <Glass height={30} width={30} />
        <TextInput
          keyboardType="numeric"
          inputMode="numeric"
          className="rounded-xl border-2 bg-slate-300 px-2 py-1"
          defaultValue={`${goals['water']}`}
          onEndEditing={(new_goal) => console.log(new_goal)}
        />
      </View>
      <View className="flex flex-row items-center gap-2 p-2">
        <Shoe height={30} width={30} />
        <TextInput
          keyboardType="numeric"
          inputMode="numeric"
          className="rounded-xl border-2 bg-slate-300 px-2 py-1"
          defaultValue={`${goals['steps']}`}
        />
      </View>
    </View>
  );
}
