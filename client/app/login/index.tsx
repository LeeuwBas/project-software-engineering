import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignInForm } from '@/components/sign-in-form';

export default function LoginScreen() {
  return (
    <RequireNoAuth>
      <SignInForm />
    </RequireNoAuth>
  );
}
