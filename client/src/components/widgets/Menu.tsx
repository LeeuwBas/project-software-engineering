import { View } from "react-native";
import WaterWidget from "./WaterWidget";

export default function Menu (
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
            <View className={`transition-opacity duration-200 ${ isOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                <View className='absolute bottom-full mb-2 items-center w-full'>
                    <View className="w-3/4 h-auto bg-grey justify-center items-center bg-white rounded-3xl shadow-sm">
                        <WaterWidget water={water} setWater={setWater}/>
                    </View>
                </View>
            </View>
        );
    }
}
