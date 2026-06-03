import { SocialConnections } from '@/components/social-connections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';

export function SignUpForm() {
  const router = useRouter();

  // These are 'states', think of them like variables that re-render the page
  // when they are changed. We use them to keep track of the user's input and
  // errors in this case. In React, this is the single most used pattern.
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const passwordInputRef = React.useRef<TextInput>(null);

  const API_URL = process.env.EXPO_PUBLIC_SERVER_ENDPOINT ?? 'http://127.0.0.1:8000';

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
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        const errors = await response.json();
        setErrors(errors);
        return;
      }

      toast.success('Account created successfully!');
      router.replace('/login');
    } catch (err) {
      console.error('Sign up request failed:', err);
      setErrors({ general: ['Could not reach the server.'] });
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in your details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {
              // This is generally confusing syntax! What it basically means is:
              // 'if errors.general: render the text'
              // And this is the basic syntax:
              // '<condition> && <expression>'
              // This is a TypeScript shorthand that is very often used in React.
              errors.general && (
                <Text className="text-sm text-destructive">{errors.general[0]}</Text>

                // There is also another short-hand that's often used, which is the
                // ternary operator. This is formatted as follows:
                // '<condition> ? <expression> : <else-expression>'
              )
            }
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
                // These 'onChangeText' handlers make these input fields 'controlled'
                // inputs, meaning the value is controlled by React state rather than
                // the native input value.
                // If we don't add this, react doesn't really 'know' the current input
                // value. This is standard practice in React forms. If we didn't do this,
                // we would have to add something like a function when the user hits 'submit' that
                // manually updates the state with the input value, which is not ideal.
                onChangeText={setEmail}
              />
              {errors.email && <Text className="text-sm text-destructive">{errors.email[0]}</Text>}
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
          </View>
          <Text className="text-center text-sm">
            Already have an account?{' '}
            <Pressable
              onPress={() => {
                router.replace('/login');
              }}>
              <Text className="text-sm underline underline-offset-4">Sign in</Text>
            </Pressable>
          </Text>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
