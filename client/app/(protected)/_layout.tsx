import {requireAuth} from "@/lib/auth/AuthManager";
import {Slot} from "expo-router";

export default function AppLayout() {
  return requireAuth(
    <Slot/>
  );
}
