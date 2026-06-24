import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ModuleSelection } from '@/components/widgets/ModuleSelection';
import { useModuleManagement } from '@/lib/useModuleManagement';
import { ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ChangeModules() {
  const { activeModules, toggleModule, isSelected, saveModules } = useModuleManagement();

  const selectedCount = Object.values(activeModules).filter(Boolean).length;

  function handleSave() {
    saveModules();
    router.back();
  }

  return (
    <ImageBackground
      source={require('@assets/background_login.png')}
      contentFit="cover"
      style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView className="size-full justify-center">
          <Card className="mx-4 gap-2 p-5">
            <ModuleSelection
              activeModules={activeModules}
              toggleModule={toggleModule}
              isSelected={isSelected}
            />

            <Button className="mt-8 w-full" disabled={selectedCount === 0} onPress={handleSave}>
              <AppText className="font-bold text-white">Change Tracked Habits</AppText>
            </Button>
          </Card>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}
