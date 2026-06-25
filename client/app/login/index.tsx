import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignInForm } from '@/components/sign-in-form';

/**
 * The login screen page. This page can only be viewed while unauthenticated
 */
export default function LoginScreen() {
  return (
    <RequireNoAuth>
      <SignInForm />
    </RequireNoAuth>
  );
}
