import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/lib/auth/AuthManager';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SignInForm() {
  const router = useRouter();
  const auth = useAuth();
  const { colorScheme } = useColorScheme();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
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
    }
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
        <Card className="m-6 mt-24 border-4 border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">Sign in</CardTitle>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              {errors.detail && <Text className="text-sm text-destructive">{errors.detail}</Text>}
              <View className="gap-1.5">
                <Label htmlFor="email">Email</Label>
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
                  <Text className="text-sm text-destructive">{errors.email[0]}</Text>
                )}
              </View>
              <View className="gap-1.5">
                <View className="flex-row items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Button
                    variant="link"
                    size="sm"
                    className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                    onPress={() => {
                      router.replace('/forgot-password');
                    }}>
                    <Text className="font-normal leading-4">Forgot your password?</Text>
                  </Button> */}
                </View>
                <Input
                  ref={passwordInputRef}
                  id="password"
                  placeholder="••••••••"
                  secureTextEntry
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  onChangeText={setPassword}
                  autoComplete="current-password"
                  textContentType="password"
                />
                {errors.password && (
                  <Text className="text-sm text-destructive">{errors.password[0]}</Text>
                )}
              </View>
              <Button className="w-full" onPress={onSubmit}>
                <Text>Continue</Text>
              </Button>

              {/* - Begin placeholder for testing - */}
              {/* uncomment this to test the routing between pages */}
              {/*<Button
                className="mt-2 w-1/2 self-center py-1"
                onPress={() => {
                  router.replace('/signup');
                }}>
                <Text className="text-sm">goto signup</Text>
              </Button>
              {/* - End placeholder for testing - */}
            </View>
          </CardContent>
        </Card>
      </SafeAreaView>
    </ImageBackground>
  );
}
