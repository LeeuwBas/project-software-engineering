import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth/AuthManager';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from './AppText';

/** TODO (buenk): docstring, maybe a few more comments? */
export function SignInForm() {
  const router = useRouter();
  const auth = useAuth();
  const { colorScheme } = useColorScheme();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [loading, setLoading] = React.useState<Boolean>(false);

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setLoading(true);

    try {
      const success = await auth.signIn(email, password);
      // on success, the RequireNoAuth in app/login/index will kick us to the homepage, and we can add a loading screen
      // to it to make this page more reactive, since right now it just sits here waiting for the server.
      if (success) {
        Keyboard.dismiss(); // sometimes my samsung glitched and the keyboard stayed untill i added this
      } else {
        setErrors({ detail: ['Wrong login credentials.'] });
      }
    } catch (err) {
      console.log('Sign in request failed:', (err as Error).message);
      setErrors({ detail: ['Could not reach the server.'] });
    } finally {
      setLoading(false);
    }
  }

  async function onCreateAccount() {
    Keyboard.dismiss();
    router.push('/onboarding');
  }

  return (
    <ImageBackground
      source={
        colorScheme === 'dark'
          ? require('@assets/dark_bg.png')
          : require('@assets/background_login.png')
      }
      contentFit="cover"
      style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ flex: 0.4 }} />
          <Card className="mx-4 shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                <AppText className="font-bold">Sign in</AppText>
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-6">
              <View className="gap-6">
                {errors.detail && (
                  <AppText className="text-sm text-red-500 opacity-80">{errors.detail}</AppText>
                )}
                <View className="gap-1.5">
                  <AppText className="font-bold">Email</AppText>
                  <Input
                    id="email"
                    placeholder="john@doe.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    onSubmitEditing={onEmailSubmitEditing}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onChangeText={setEmail}
                  />
                  {errors.email && (
                    <Text className="text-sm text-red-500 opacity-80">{errors.email[0]}</Text>
                  )}
                </View>
                <View className="gap-1.5">
                  <AppText className="font-bold">Password</AppText>
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    placeholder="••••••••"
                    secureTextEntry
                    returnKeyType="send"
                    autoCapitalize="none"
                    onSubmitEditing={onSubmit}
                    onChangeText={setPassword}
                    autoComplete="current-password"
                    textContentType="password"
                  />
                  {errors.password && (
                    <Text className="text-sm text-red-500">{errors.password[0]}</Text>
                  )}
                </View>
                {loading ? (
                  <Button className="w-full py-0" variant="outline" onPress={null}>
                    <AppText className="font-bold">Loading...</AppText>
                  </Button>
                ) : (
                  <Button className="w-full py-0" variant="default" onPress={onSubmit}>
                    <AppText className="font-bold text-white">Continue</AppText>
                  </Button>
                )}
                <Button className="w-full py-0" onPress={onCreateAccount}>
                  <AppText className="font-bold text-white">Create Account</AppText>
                </Button>
              </View>
            </CardContent>
          </Card>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
