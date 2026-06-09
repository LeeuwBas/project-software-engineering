import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Handles water in storage. May be used as template for future objects.
export function useWater(menuOpen : boolean) {
    const [water, setWater] = useState(0);
    const [loaded, setLoaded] = useState(false); // Prevents stored value from being overwritten by init.

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

    // Gets water data from storage on render.
    useEffect(() => {
        async function getWater() {
            const saved_water = await getWaterData();
            setWater(saved_water);
            setLoaded(true);
            console.log('retrieved water ' + saved_water)
        }

        getWater();
    }, [])

    // Sends water data to storage when popup menu is closed.
    useEffect(() => {
        if (!menuOpen && loaded) {
            console.log('saved water ' + water);
            setWaterData(water);
        }
    }, [water, loaded, menuOpen]);

    return {water, setWater};
}

export function petContextInit() {
    const [id, setId] = useState(0)

    async function getIdData(): Promise<number> {
        try {
            const id = await AsyncStorage.getItem('pet_id');
            return id !== null ? parseInt(id) : 0;
        } catch(error) {
            console.error('Getting pet id went wrong', error)
            return 0
        }
    }

    async function saveId(id: number) {
        try {
            await AsyncStorage.setItem('pet_id', JSON.stringify(id));
        } catch (error) {
            console.error('Setting pet id went wrong.', error);
        }
        setId(id)
        console.log('saved pet id ' + id)
    }

    useEffect(() => {
        async function getId() {
            const saved_id = await getIdData();
            setId(saved_id);
            console.log('retrieved pet id ' + saved_id)
        }

        getId();
    }, [])

    return {id, setId, saveId}
}
