import { View } from 'react-native';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangeName } from '@/components/widgets/ChangeName';
import { useNameManagement } from '@/lib/useNameManagement';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export function PetNamingStep({ onNext, onBack }: Props) {
  const { petName, setPetName, userName, setUserName, errors, validateAndSave } =
    useNameManagement();

  function handleConfirm() {
    const isValid = validateAndSave();
    if (isValid) {
      onNext?.();
    }
  }

  return (
    <KeyboardProvider>
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
            <Button
              disabled={petName.length === 0 || userName.length === 0}
              onPress={handleConfirm}>
              <AppText className="font-bold text-white">Continue to Signup</AppText>
            </Button>

            <Button variant="outline" onPress={onBack}>
              <AppText className="font-bold">Choose another companion</AppText>
            </Button>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}
