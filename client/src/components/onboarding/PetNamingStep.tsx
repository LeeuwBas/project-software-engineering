import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangeName } from '@/components/widgets/ChangeName';
import { useNameManagement } from '@/lib/useNameManagement';
import { View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

/**
 * Pet naming widget for the onboarding process.
 * Serves as an interface for a user to save pet and username.
 *
 * @param {Props} onNext -
 *  Function to handle in-page routing to the next step of onboarding
 * @param {Props} onBack -
 *  Function to handle in-page routing to the prevous step of onboarding
 * @return {React.JSX.Element} Pet naming widget
 */
export function PetNamingStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { petName, setPetName, userName, setUserName, errors, validateAndSave } =
    useNameManagement();

  function handleConfirm() {
    const isValid = validateAndSave();
    if (isValid) {
      onNext();
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{ flex: 1 }}>
      <View style={{ flex: 0.3 }} />

      <Card className="mx-4 border-border bg-background/80 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            <AppText className="font-bold">Making Acquaintance</AppText>
          </CardTitle>
        </CardHeader>

        <ChangeName
          petName={petName}
          setPetName={setPetName}
          userName={userName}
          setUserName={setUserName}
          errors={errors}
        />

        <View className="gap-2 px-6 pb-6">
          <Button disabled={petName.length === 0 || userName.length === 0} onPress={handleConfirm}>
            <AppText className="font-bold text-white">Save Names</AppText>
          </Button>

          <Button variant="outline" onPress={onBack}>
            <AppText className="font-bold">Choose Another Companion</AppText>
          </Button>
        </View>
      </Card>
    </KeyboardAvoidingView>
  );
}
