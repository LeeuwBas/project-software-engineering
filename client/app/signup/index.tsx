import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignUpForm } from '@/components/sign-up-form';

/**
 * The signup screen for the app. Can only be viewed while unauthenticated.
 */
export default function SignUpScreen() {
  return (
    <RequireNoAuth>
      <SignUpForm />
    </RequireNoAuth>
  );
}
