import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { savePetName, saveUserName } from '@/lib/settings';
import { ChangeName } from '@/components/widgets/ChangeName'; // Zorg dat dit pad klopt

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export function PetNamingStep({ onNext, onBack }: Props) {
  const [petName, setPetName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[] | null>>({});

  function validateName(name: string) {
    const regex = /^[A-Za-z]+$/;
    return regex.test(name);
  }

  function validateAndSetErrors() {
    let isValid = true;
    const newErrors: Record<string, string[] | null> = { pet: null, user: null };

    if (!validateName(petName)) {
      newErrors.pet = ['Only include (capitalized) letters.'];
      isValid = false;
    }

    if (!validateName(userName)) {
      newErrors.user = ['Only include (capitalized) letters.'];
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function confirm() {
    if (validateAndSetErrors()) {
      savePetName(petName);
      saveUserName(userName);
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

          <View className="px-6 pb-6 gap-2">
            <Button disabled={petName.length === 0 || userName.length === 0} onPress={confirm}>
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