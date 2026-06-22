import RequireNoAuth from '@/components/auth/RequireNoAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';

export default function Index() {
  AsyncStorage.getAllKeys().then((keys) => {
    console.log(keys);
  });

  return (
    <RequireNoAuth loading={null}>
      <Redirect href="/onboarding" />
    </RequireNoAuth>
  );
}
