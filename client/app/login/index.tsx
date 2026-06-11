import { SignInForm } from '@/components/sign-in-form';
import { redirectIfAuth } from "@/lib/auth/AuthManager";

export default function LoginScreen() {
  return redirectIfAuth(<SignInForm />);
}
