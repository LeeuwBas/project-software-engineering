import Main from '@/components/widgets/mainview';
import Toolbar from '@/components/widgets/toolbar';
import Topbar from '@/components/widgets/topbar';
import * as storage from '@/lib/storage';
import { PopupConfigs } from '@/lib/types';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { AppState, Pressable, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const auth = useAuth();
  if (process.env.EXPO_PUBLIC_DISABLE_AUTH === 'True') return <Redirect href="/(protected)" />;
  if (auth?.isLoading) return null;
  return <Redirect href={auth?.accessToken ? '/(protected)' : '/login'} />;
}
