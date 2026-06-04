import { Image } from "expo-image";
import { View } from "react-native";

export default function Tamagotchi() {
    return (
        <View className="w-3/5 mx-auto">
            <Image style={{width: "100%", aspectRatio: 1}} contentFit="cover" source={require("@/../assets/onigiri_sprite.webp")}/>
        </View>
    );
}
