import { Button } from "@/components/ui/button";
import ProfilePopup from "@/components/widgets/ProfilePopup";
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1">
        <View className="mt-auto items-center">
          <Button variant="outline" onPress={() => setOpen(true)}>
            <Text>Profile</Text>
          </Button>
        </View>
        <ProfilePopup open={open} setOpen={setOpen} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
