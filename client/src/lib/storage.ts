import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setWaterData(water: number) {
    try {
        await AsyncStorage.setItem('water', JSON.stringify(water));
    } catch (error) {
        console.error('Setting water went wrong.', error);
    }
}

export async function getWaterData(): Promise<number> {
    try {
        const water = await AsyncStorage.getItem('water');
        return water !== null ? parseInt(water) : 0;
    } catch (error) {
        console.error('Getting water went wrong.', error);
        return 0;
    }
}
