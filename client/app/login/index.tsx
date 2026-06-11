import { SignInForm } from '@/components/sign-in-form';
import {requireNoAuth} from "@/lib/auth/AuthManager";

export default function LoginScreen() {
  return requireNoAuth(<SignInForm />);
}
