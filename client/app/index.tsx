import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <RequireNoAuth loading={null}>
      <Redirect href="/onboarding" />
    </RequireNoAuth>
  );
}
