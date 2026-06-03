import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setWater(water: number) {
    try {
        await AsyncStorage.setItem('water', JSON.stringify(water));
    } catch (error) {
        console.error('Setting water went wrong.', error);
    }
}

export async function getWater() {
    try {
        const water = await AsyncStorage.getItem('water');
    } catch (error) {
        console.error('Getting water went wrong.', error);
    }
}
