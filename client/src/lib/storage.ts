import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
    chosenPet: String,
}

interface StatLine {
    waterDrank: number,
}

interface StatisticsData {
    entries: number,
    Statistics: Record<string, StatLine>,
}

export interface StatisticsSummary {
    statisticName: string,
    isFull: boolean,
    total: number,
    count: number,
    average: number,
    minimum: number,
    maximum: number,
}

export interface StatisticsBarChart {
    statisticName: string,
    isFull: boolean,
    daysPerBin: number,
    bins: number[],
}

// ---------------------------------- Statistics Functions ----------------------------------

/*
 * Creates a string to serve as the key to the database. Takes in a Date object and turns it into a key for the
 * storage.
 *
 * Key format is: "yyyy-mm-dd"
 */
function calculateDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate() + 1).padStart(2, '0');

    return `${year}-${month}-${day}`
}

/*
 * Returns a statistic from a single day.
 *
 * Expects the statName to be one of the internal statistic key names.
 */
async function getDayStat(statName: string, day: Date) {
    const date = calculateDate(day);
    const raw = await AsyncStorage.getItem('Statistics')

    const data: StatisticsData| null = raw ? JSON.parse(raw) : null;

    if (data == null) {
        return null
    }

    return data.Statistics[date][statName as keyof StatLine];
}

/*
 * Gets all existing entries of a specific statistic in the given date range.
 */
async function getRangeStat(statName: string, lowerDay: Date, upperDay: Date) {
    const lowerDate = calculateDate(lowerDay);
    const upperDate = calculateDate(upperDay);

    const raw = await AsyncStorage.getItem('Statistics')
    const data: StatisticsData = raw ? JSON.parse(raw) : null;

    if (data == null) {
        return null;
    }

    const entries = Object.entries(data.Statistics).filter(([date]) => lowerDate < date && date <= upperDate)
        .sort(([one], [two]) => (one > two ? -1 : 1));

    return Object.values(entries).map(([_, entry]) => entry[statName as keyof StatLine]);
}

export async function getStatSummary(statName: string, days: number) {
    const today = new Date();
    const lowerDay = new Date();
    lowerDay.setDate(today.getDate() - days);

    const values = await getRangeStat(statName, lowerDay, today);

    if (values == null) {
        return null;
    }

    const returnValue: Partial<StatisticsSummary> = {statisticName: statName};

    returnValue.total = values.reduce((Acc, x, _) => Acc + x);
    returnValue.count = values.length;
    returnValue.average = returnValue.total / returnValue.count;
    returnValue.maximum = values.reduce((Acc, x, _) => Acc > x ? Acc : x);
    returnValue.minimum = values.reduce((Acc, x, _) => Acc < x ? Acc : x);

    returnValue.isFull = returnValue.count == days

    return returnValue as StatisticsSummary
}

export async function getStatBarChart(statName: string, days: number, binCount: number) {

    if (days % binCount != 0) {
        return null;
    }

    var today = new Date();
    var lowerDay = new Date();
    lowerDay.setDate(today.getDate() - days);

    const returnValue: Partial<StatisticsBarChart> = {statisticName: statName};
    returnValue.bins = [];
    returnValue.daysPerBin = days / binCount;
    returnValue.isFull = true;

    for (let i = 0; i < binCount; i++) {
        const values = await getRangeStat(statName, lowerDay, today);

        if (values == null) {
            return null;
        }

        if (values.length < returnValue.daysPerBin) {
            returnValue.isFull = false;
        }

        returnValue.bins.push(values.reduce((Acc, x, _) => Acc + x) / values.length);

        lowerDay = today
        today.setDate(today.getDate() + returnValue.daysPerBin);
    }

    return returnValue as StatisticsBarChart
}

// ---------------------------------- Settings Functions ----------------------------------


// ------------------------------- Deprecated Water Funtions ------------------------------

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
