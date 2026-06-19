import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { TextInput, View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ENDPOINT } from '@/lib/api/ApiEndpoint';
import { useAuth } from '@/lib/auth/AuthManager';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { toast } from 'sonner-native';
import { useTutorial } from '@/lib/settings';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';

type Props = {
  onNext?: () => void;
};

export function AccountCreationStep({ onNext }: Props) {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const [loading, setLoading] = React.useState<Boolean>(false);

  const { resetTutorial } = useTutorial();

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setLoading(true);

    const username = 'placeholder';

    try {
      const response = await fetch(`${API_ENDPOINT}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        const errors = await response.json();
        setErrors(errors);
        return;
      }

      resetTutorial();

      toast.success('Account created successfully!');
      const success = await auth.signIn(email, password);
      if (!success) {
        toast.error('Sign in after sign up failed, please sign in again.');
        router.replace('/login');
        throw Error('Sign in failed');
      }
      onNext?.();
    } catch (err) {
      console.error('Sign up request failed:', err);
      setErrors({ general: ['Could not reach the server.'] });
    } finally {
      setLoading(false);
    }
  }

  async function onGuestSubmit() {
    await auth.setGuest();
    resetTutorial();
    onNext?.();
  }

  return (
    <KeyboardProvider>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <View style={{ flex: 0.3 }} />

        <Card className="mx-4 border-border bg-background/80 shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              <AppText>Create account</AppText>
            </CardTitle>
          </CardHeader>

          <CardContent className="gap-5">
            {errors.general && (
              <AppText className="text-sm font-bold text-red-500 opacity-80">
                {errors.general[0]}
              </AppText>
            )}

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
                <AppText className="text-sm text-red-500 opacity-80">{errors.email[0]}</AppText>
              )}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password">Password</Label>

              <Input
                ref={passwordInputRef}
                id="password"
                placeholder="••••••••"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                onChangeText={setPassword}
                autoComplete="new-password"
                textContentType="newPassword"
              />

              {errors.password && (
                <AppText className="text-sm text-red-500 opacity-80">{errors.password[0]}</AppText>
              )}
            </View>

            {loading ? (
              <Button className="w-full py-0" variant="outline" onPress={null}>
                <AppText>Loading...</AppText>
              </Button>
            ) : (
              <Button className="w-full py-0" variant="default" onPress={onSubmit}>
                <AppText>Sign Up & Continue</AppText>
              </Button>
            )}
            <Button className="w-full" variant="outline" onPress={onGuestSubmit}>
              <AppText>Continue as guest</AppText>
            </Button>
          </CardContent>
        </Card>
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}
