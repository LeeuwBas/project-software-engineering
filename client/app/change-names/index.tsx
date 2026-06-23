import { View } from 'react-native';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ChangeName } from '@/components/widgets/ChangeName';
import { useNameManagement } from '@/lib/useNameManagement';
import { router } from 'expo-router';
import { getPetName, getUserName } from '@/lib/settings';
import { ImageBackground } from 'expo-image';

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export default function PetNamingStep({ onNext, onBack }: Props) {
  const currentUserName = getUserName();
  const currentPetName = getPetName();

  const { petName, setPetName, userName, setUserName, errors, validateAndSave } = useNameManagement(
    currentPetName,
    currentUserName
  );

  function handleConfirm() {
    const isValid = validateAndSave();
    if (isValid) {
      onNext?.();
      router.back();
    }
  }

  return (
    <ImageBackground
      source={require('@assets/background_login.png')}
      contentFit="cover"
      style={{ flex: 1 }}>
      <KeyboardProvider>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ flex: 0.3 }} />

          <Card className="mx-4 border-border bg-background/80 shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-xl sm:text-left">
                <AppText className="font-bold">Change names</AppText>
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
                <AppText className="font-bold text-white">Change names</AppText>
              </Button>
            </View>
          </Card>
        </KeyboardAvoidingView>
      </KeyboardProvider>
    </ImageBackground>
  );
}
