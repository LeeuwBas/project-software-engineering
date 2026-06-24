import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { TextInput, View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { API_ENDPOINT } from '@/lib/api/ApiEndpoint';
import { useAuth } from '@/lib/auth/AuthManager';
import { useTutorial } from '@/lib/settings';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { toast } from 'sonner-native';

/**
 * Signup widget of the onboarding process.
 * Serves as UI for a user to save their email and password for their account.
 *
 * @return {React.JSX.Element} Signup widget
 */
export function AccountCreationStep() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const [loading, setLoading] = React.useState<Boolean>(false);
  const [loadingGuest, setLoadingGuest] = React.useState<Boolean>(false);

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
      router.replace('/(protected)');
    } catch (err) {
      console.error('Sign up request failed:', err);
      setErrors({ general: ['Could not reach the server.'] });
    } finally {
      setLoading(false);
    }
  }

  async function onGuestSubmit() {
    setLoadingGuest(true);
    await auth.setGuest();
    resetTutorial();
    setLoadingGuest(false);
    router.replace('/(protected)');
  }

  return (
    <KeyboardProvider>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} style={{ flex: 1 }}>
        <View style={{ flex: 0.3 }} />

        <Card className="mx-4 border-border bg-background/80 shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              <AppText className="font-bold">Create account</AppText>
            </CardTitle>
          </CardHeader>

          <CardContent className="gap-5">
            {errors.general && (
              <AppText className="text-sm font-bold text-red-500 opacity-80">
                {errors.general[0]}
              </AppText>
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
                <AppText className="text-sm text-red-500 opacity-80">{errors.email[0]}</AppText>
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
                autoComplete="new-password"
                textContentType="newPassword"
              />

              {errors.password && (
                <AppText className="text-sm text-red-500 opacity-80">{errors.password[0]}</AppText>
              )}
            </View>

            {loading ? (
              <Button className="w-full" variant="outline" onPress={null}>
                <AppText className="font-bold">Loading...</AppText>
              </Button>
            ) : (
              <Button className="w-full" variant="default" onPress={onSubmit}>
                <AppText className="font-bold text-white">Sign Up & Go to Tutorial</AppText>
              </Button>
            )}
            {loadingGuest ? (
              <Button className="w-full" variant="outline" onPress={null}>
                <AppText className="font-bold">Loading...</AppText>
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onPress={onGuestSubmit}>
                <AppText className="font-bold">Continue as Guest</AppText>
              </Button>
            )}
          </CardContent>
        </Card>
      </KeyboardAvoidingView>
    </KeyboardProvider>
  );
}
