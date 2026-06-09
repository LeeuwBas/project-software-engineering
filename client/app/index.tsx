import { requireAuth } from '@/auth/AuthManager';
import { Redirect } from 'expo-router';

export default function Index() {
  return requireAuth(
    <Redirect href="/(protected)"/>
  )
}
