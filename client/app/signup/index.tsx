import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignUpForm } from '@/components/sign-up-form';

// TODO (LeeuwBas, buenk): Why is this in an index.tsx instead of a _layout.tsx,
// what is router.Slot and why aren't we using it here?
export default function SignUpScreen() {
  return (
    <RequireNoAuth>
      <SignUpForm />
    </RequireNoAuth>
  );
}
