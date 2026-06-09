import { View } from "react-native";
import { AppText } from "../AppText";
import StepsWidget from "./StepsWidget";
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

    // TODO: Add backend for retrieving name
    const name = 'Alex'

    if (isOpen) {
        return (
            <View className={`-top-6 w-full transition-opacity duration-200 ${ isOpen ? 'opacity-100' : 'opacity-0' } items-center`} >
                <View className='absolute bottom-full mb-2 items-center w-full'>
                    <View className="w-3/4 h-auto justify-center items-center bg-white rounded-3xl shadow-sm">
                        <AppText className='m-5 font-bold text-2xl'>{name}</AppText>
                        <WaterWidget water={water} setWater={setWater}/>
                        <StepsWidget/>
                    </View>
                </View>
            </View>
        );
    }
}
