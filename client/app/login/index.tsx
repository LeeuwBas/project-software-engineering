import RequireNoAuth from '@/components/auth/RequireNoAuth';
import { SignInForm } from '@/components/sign-in-form';

/** TODO (LeeuwBas, buenk): docstring. also why is this in an index.tsx instead of a _layout.tsx,
 * what is router.Slot and why aren't we using it here? */
export default function LoginScreen() {
  return (
    <RequireNoAuth>
      <SignInForm />
    </RequireNoAuth>
  );
}
