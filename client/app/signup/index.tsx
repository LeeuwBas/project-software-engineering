import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignUpForm } from '@/components/sign-up-form';

export default function SignUpScreen() {
  return (
    <RequireNoAuth>
      <SignUpForm />
    </RequireNoAuth>
  );
}
