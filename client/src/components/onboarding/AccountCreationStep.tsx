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

type Props = {
  onNext?: () => void;
  onBack?: () => void;
};

export function AccountCreationStep({ onNext, onBack }: Props) {
  const router = useRouter();

  // These are 'states', think of them like variables that re-render the page
  // when they are changed. We use them to keep track of the user's input and
  // errors in this case. In React, this is the single most used pattern.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const [loading, setLoading] = React.useState<Boolean>(false);

  const { signIn } = useAuth();

  const { resetTutorial } = useTutorial()

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    // This function sends the form data to the server as JSON.
    //
    // On success, the server shows a toast (a popup) and redirects the user.
    //
    // If the server returns an error, we 'catch' it (using the try/catch JS syntax)
    // and update the error state. As soon as the error state is updated,
    // the page is 'reloaded' and the error message is displayed to the user.
    setLoading(true)

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
      const success = await signIn(email, password)
      if (!success) {
        toast.error('Sign in after sign up failed, please sign in again.')
        router.replace('/login')
        throw Error('Sign in failed')
      }
      onNext?.()
    } catch (err) {
      console.error('Sign up request failed:', err);
      setErrors({ general: ['Could not reach the server.'] });
    }
    setLoading(false)
  }

  return (
    <Card className="mx-4 border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-center text-xl sm:text-left">Create account</CardTitle>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="gap-6">
          {errors.general && <AppText className="font-bold">{errors.general[0]}</AppText>}
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
            {errors.email && <AppText className="font-bold">{errors.email[0]}</AppText>}
          </View>
          <View className="gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Your username"
              autoComplete="username"
              autoCapitalize="none"
              returnKeyType="next"
              submitBehavior="submit"
              onChangeText={setUsername}
            />
            {errors.username && <AppText className="font-bold">{errors.username[0]}</AppText>}
          </View>
          <View className="gap-1.5">
            <View className="flex-row items-center">
              <Label htmlFor="password">Password</Label>
            </View>
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
            {errors.password && <AppText className="font-bold">{errors.password[0]}</AppText>}
          </View>
          {
            loading
            ? (
              <Button
                className="w-full py-0"
                variant="outline"
                onPress={null}
              >
                <AppText className="font-bold">Loading...</AppText>
              </Button>
            )
            : (
              <Button
                className="w-full py-0"
                variant="default"
                onPress={() => {onSubmit()}}
              >
                <AppText className="font-bold text-white">Continue</AppText>
              </Button>
            )
          }

          {onBack && (
            <Button className="w-full py-0" onPress={onBack}>
              <AppText className="font-bold text-white">Back</AppText>
            </Button>
          )}
        </View>
      </CardContent>
    </Card>
  );
}
