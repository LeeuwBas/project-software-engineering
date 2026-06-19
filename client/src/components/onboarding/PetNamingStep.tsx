import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { savePetName, saveUserName } from '@/lib/settings';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export function PetNamingStep({ onNext, onBack }: Props) {
  const [petName, setPetName] = useState('');
  const [userName, setUserName] = useState('');

  const maxNameLength = 16;

  function confirm() {
    savePetName(petName);
    saveUserName(userName);

    onNext?.();
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

          <CardContent className="gap-5">
            <View className="gap-1.5">
              <AppText>What is your companion's name?</AppText>

              <Input
                placeholder="Companion name"
                autoCapitalize="words"
                returnKeyType="next"
                value={petName}
                onChangeText={setPetName}
                maxLength={maxNameLength}
              />

              <AppText className="text-right">
                {petName.length}/{maxNameLength}
              </AppText>
            </View>

            <View className="gap-1.5">
              <AppText>What is your name?</AppText>

              <Input
                placeholder="Your name"
                autoCapitalize="words"
                returnKeyType="done"
                value={userName}
                onChangeText={setUserName}
                maxLength={maxNameLength}
              />

              <AppText className="text-right">
                {userName.length}/{maxNameLength}
              </AppText>
            </View>
            <View className="gap-2">
              <Button
                disabled={petName.trim().length === 0 || userName.trim().length === 0}
                onPress={confirm}>
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
    </KeyboardProvider>
  );
}
