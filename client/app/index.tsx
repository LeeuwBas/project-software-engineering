import { requireAuth } from '@/lib/auth/AuthManager';
import { Redirect } from 'expo-router';

export default function Index() {
  return requireAuth(
    <Redirect href="/(protected)"/>
  )
}
