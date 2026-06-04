import { SignUpForm } from '@/components/sign-up-form';
import {requireNoAuth} from "@/auth/AuthManager";

export default function SignUpScreen() {
  return requireNoAuth(<SignUpForm />);
}
