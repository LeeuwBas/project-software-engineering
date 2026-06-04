import { View } from "react-native";
import WaterWidget from "./WaterWidget";

export default function PopUpmenu (
    {
        isOpen,
        water,
        setWater
    }: {
        isOpen : boolean,
        water : number,
        setWater : (value: number) => void
    }) {
    if (isOpen) {
        return (
            <View className='absolute bottom-full mb-2 items-center w-full'>
                <View className="w-3/4 h-1/2 bg-grey flex-1 justify-center items-center bg-white rounded-3xl">
                    <WaterWidget water={water} setWater={setWater}>

                    </WaterWidget>
                </View>
            </View>
        );
    }
}
