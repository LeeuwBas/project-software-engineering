import Toolbar from '@/components/widgets/toolbar';
import { PortalHost } from '@rn-primitives/portal';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import '../global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className='bg-yellow-200 h-full'>
        {/* <WaterWidget startValue={50} /> */}
        <Toolbar />
      </SafeAreaView>
    <PortalHost />
    </SafeAreaProvider>
  );
}

