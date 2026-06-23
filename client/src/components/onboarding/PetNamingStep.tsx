import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { savePetName, saveUserName } from '@/lib/settings';
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

/** TODO (AlexAugustijn): docstring */
export function PetNamingStep({ onNext, onBack }: Props) {
  const [petName, setPetName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[] | null>>({});

  const maxPetNameLength = 12;
  const maxUserNameLength = 16;

  function confirm() {
    const petNameCorrect = validatePetName();
    const userNameCorrect = validateUserName();
    if (petNameCorrect && userNameCorrect) {
      savePetName(petName);
      saveUserName(userName);

      onNext?.();
    } else {
      return;
    }
  }

  function validateName(name: string) {
    const regex = /^[A-Za-z]+$/;

    return regex.test(name);
  }

  function validatePetName() {
    const petNameStatus = validateName(petName);
    if (petNameStatus) {
      setPetName(petName);
      setErrors((prev) => ({
        ...prev,
        pet: null,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        pet: ['Only include (capitalized) letters.'],
      }));
    }
    return petNameStatus;
  }

  function validateUserName() {
    const userNameStatus = validateName(userName);
    if (userNameStatus) {
      setUserName(userName);
      setErrors((prev) => ({
        ...prev,
        user: null,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        user: ['Only include (capitalized) letters.'],
      }));
    }
    return userNameStatus;
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

        <CardContent className="gap-5">
          <View className="gap-1.5">
            <AppText className="font-bold">What is your companion's name?</AppText>

            <Input
              placeholder="Companion name"
              autoCapitalize="words"
              returnKeyType="next"
              value={petName}
              onChangeText={setPetName}
              maxLength={maxPetNameLength}
            />

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                {errors.pet && (
                  <AppText numberOfLines={1} className="text-sm text-red-500 opacity-80">
                    {errors.pet[0]}
                  </AppText>
                )}
              </View>

              <AppText className="text-right">
                {petName.length}/{maxPetNameLength}
              </AppText>
            </View>
          </View>

          <View className="gap-1.5">
            <AppText className="font-bold">What is your name?</AppText>

            <Input
              placeholder="Your name"
              autoCapitalize="words"
              returnKeyType="done"
              value={userName}
              onChangeText={setUserName}
              maxLength={maxUserNameLength}
            />

            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                {errors.user && (
                  <AppText numberOfLines={1} className="text-sm text-red-500 opacity-80">
                    {errors.user[0]}
                  </AppText>
                )}
              </View>

              <AppText className="text-right">
                {userName.length}/{maxUserNameLength}
              </AppText>
            </View>
          </View>
          <View className="gap-2">
            <Button disabled={petName.length === 0 || userName.length === 0} onPress={confirm}>
              <AppText className="font-bold text-white">Continue to Signup</AppText>
            </Button>

            <Button
              variant="outline"
              onPress={() => {
                onBack?.();
              }}>
              <AppText className="font-bold">Choose another companion</AppText>
            </Button>
          </View>
        </CardContent>
      </Card>
    </KeyboardAvoidingView>
  );
}
