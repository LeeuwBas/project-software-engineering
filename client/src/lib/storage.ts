import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Handles water in storage. May be used as template for future objects.
export function useWater(menuOpen : boolean) {
    const [water, setWater] = useState(0);

    // Sends water value to storage.
    async function setWaterData(water: number) {
        try {
            await AsyncStorage.setItem('water', JSON.stringify(water));
        } catch (error) {
            console.error('Setting water went wrong.', error);
        }
    }

    // Gets water value from storage.
    async function getWaterData(): Promise<number> {
        try {
            const water = await AsyncStorage.getItem('water');
            return water !== null ? parseInt(water) : 0;
        } catch (error) {
            console.error('Getting water went wrong.', error);
            return 0;
        }
    }

    function saveWater(value: number) {
        setWaterData(value)
        setWater(value)
        console.log('saved water ' + value)
    }

    // Gets water data from storage on render.
    useEffect(() => {
        async function getWater() {
            const saved_water = await getWaterData();
            setWater(saved_water);
            console.log('retrieved water ' + saved_water)
        }

        getWater();
    }, [])

    return {water, saveWater};
}
