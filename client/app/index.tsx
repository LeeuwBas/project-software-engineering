import { redirectUnlessAuth } from '@/lib/auth/AuthManager';
import { Redirect } from 'expo-router';

export default function Index() {
  return redirectUnlessAuth(
    <Redirect href="/(protected)"/>
  )
}
