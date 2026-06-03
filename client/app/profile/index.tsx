import { Button } from "@/components/ui/button";
import { View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
    return (
    <SafeAreaProvider>
        <SafeAreaView className="h-full">
            <View className="mt-auto items-center">
                <Button variant='outline'>
                    <Text>
                        Profile
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}