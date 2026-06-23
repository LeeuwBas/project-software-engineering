import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { Redirect } from 'expo-router';

/** The entry point for the app, after everything in _layout.tsx is loaded. Either gets redirected to the homepage
 * via RequireNoAuth if already logged in, otherwise routes to onboarding.
 */
export default function Index() {
  return (
    <RequireNoAuth loading={null}>
      <Redirect href="/onboarding" />
    </RequireNoAuth>
  );
}
