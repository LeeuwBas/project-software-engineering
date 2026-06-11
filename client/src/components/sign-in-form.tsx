import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useAuth } from '@/lib/auth/AuthManager';
import { SafeAreaView } from 'react-native-safe-area-context';

export function SignInForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    try {
      const success = await auth?.signIn(email, password);

      if (success) {
        router.replace('/');
      } else {
        setErrors({ detail: ['Wrong login credentials.'] });
      }
    } catch (err) {
      console.error('Sign in request failed:');
      setErrors({ detail: ['Could not reach the server.'] });
    }
  }

  return (
    <SafeAreaView className="flex-1 gap-6">
      <Card className="border-border/0 shadow-none m-6 mt-auto border-4 sm:border-border sm:shadow-sm sm:shadow-black/5">
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
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
                submitBehavior="submit"
                onChangeText={setEmail}
              />
              {errors.email && <Text className="text-sm text-destructive">{errors.email[0]}</Text>}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => {
                    router.replace('/forgot-password');
                  }}>
                  <Text className="font-normal leading-4">Forgot your password?</Text>
                </Button>
              </View>
              <Input
                ref={passwordInputRef}
                id="password"
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
          </View>
          <View className="flex flex-row items-center">
            <Text className="text-center text-sm">Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.replace('/signup')}>
              <Text className="text-sm underline underline-offset-4">Sign up</Text>
            </Pressable>
          </View>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
