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

  const API_URL = process.env.SERVER_ENDPOINT;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
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
      setErrors({ general: ['Could not reach the server.'] });
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in your details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {errors.general && (
              <Text className="text-destructive text-sm">{errors.general[0]}</Text>
            )}
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
              {errors.email && <Text className="text-destructive text-sm">{errors.email[0]}</Text>}
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
                <Text className="text-destructive text-sm">{errors.username[0]}</Text>
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
                <Text className="text-destructive text-sm">{errors.password[0]}</Text>
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
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
