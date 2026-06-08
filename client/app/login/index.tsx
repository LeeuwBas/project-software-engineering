import { SignInForm } from '@/components/sign-in-form';
import {requireNoAuth} from "@/auth/AuthManager";

export default function LoginScreen() {
  return requireNoAuth(<SignInForm />);
}
