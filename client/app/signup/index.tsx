import { SignUpForm } from '@/components/sign-up-form';
import { redirectIfAuth } from "@/lib/auth/AuthManager";

export default function SignUpScreen() {
  return redirectIfAuth(<SignUpForm />);
}
