import { useAuth } from '@/auth/AuthManager';
import { Redirect } from 'expo-router';

export default function Index() {
  const auth = useAuth();
  if (process.env.EXPO_PUBLIC_DISABLE_AUTH === 'True') return <Redirect href="/(protected)" />;
  if (auth?.isLoading) return null;
  return <Redirect href={auth?.accessToken ? '/(protected)' : '/login'} />;
}
