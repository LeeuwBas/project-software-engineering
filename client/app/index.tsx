import RequireAuth from '@/components/auth/RequireAuth';
import { Redirect } from 'expo-router';

export default function Index() {
  return (
    <RequireAuth href={'/onboarding'}>
      <Redirect href="/(protected)" />
    </RequireAuth>
  );
}
