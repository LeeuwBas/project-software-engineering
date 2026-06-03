import { Button } from "@/components/ui/button";
import { View, Text, Animated, Dimensions, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const PEEK_TOP = 80;

export default function ProfilePage() {
    const [open, setOpen] = useState(false);
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        Animated.spring(translateY, {
            toValue: open ? 0 : SCREEN_HEIGHT,
            useNativeDriver: true,
        }).start();
    }, [open, translateY]);

    return (
    <SafeAreaProvider>
        <SafeAreaView className="h-full">
            <View className="mt-auto items-center">
                <Button variant='outline' onPress={() => setOpen(true)}>
                    <Text>
                        Profile
                    </Text>
                </Button>
            </View>
            {open && (
                <Pressable
                    className="absolute inset-0"
                    onPress={() => setOpen(false)}
                />
            )}

            <Animated.View
                style={{
                    transform: [{ translateY }],
                    position: "absolute",
                    top: PEEK_TOP,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                className="bg-white rounded-t-3xl"
                >
                <Text>Settings komen hier</Text>
            </Animated.View>
        </SafeAreaView>
    </SafeAreaProvider>
    )
}