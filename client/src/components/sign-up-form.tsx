import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { API_ENDPOINT } from '@/lib/api/ApiEndpoint';
import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { useTutorial } from '@/lib/settings';

export function SignUpForm() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  // These are 'states', think of them like variables that re-render the page
  // when they are changed. We use them to keep track of the user's input and
  // errors in this case. In React, this is the single most used pattern.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const passwordInputRef = React.useRef<TextInput>(null);
  const { resetTutorial } = useTutorial();

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

      resetTutorial(); // Possibly need to require auth here?

      toast.success('Account created successfully!');
      router.replace('/login');
    } catch (err) {
      console.error('Sign up request failed:', err);
      setErrors({ general: ['Could not reach the server.'] });
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
        <Card className="mx-4 border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-left">Create account</CardTitle>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              {errors.general && (
                <Text className="text-sm text-destructive">{errors.general[0]}</Text>
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
                  <Text className="text-sm text-destructive">{errors.email[0]}</Text>
                )}
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
                {errors.username && (
                  <Text className="text-sm text-destructive">{errors.username[0]}</Text>
                )}
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
                  router.replace('/login');
                }}>
                <Text className="text-sm">goto login</Text>
              </Button>
              {/* - End placeholder for testing - */}
            </View>
          </CardContent>
        </Card>
      </SafeAreaView>
    </ImageBackground>
  );
}
