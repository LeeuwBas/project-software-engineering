import RequireNoAuth from '@/components/auth/RequireAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <RequireNoAuth>
      <Redirect href="/onboarding" />
    </RequireNoAuth>
  );
}
