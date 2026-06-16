import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateDifference } from './utils';
import { useEffect, useState } from 'react';

const statPrefix = 'Stats-';
const goalPrefix = 'Goals-';

interface Settings {
    chosenPet: String;
}

export interface StatLine {
    waterDrank: number | null;
    sleep: number | null;
    stress: number | null;
    food: number | null;
}

export interface StatisticsSummary {
    statisticName: string;
    isFull: boolean;
    total: number;
    count: number;
    average: number;
    minimum: number;
    maximum: number;
}

export interface StatisticsBarChart {
    statisticName: string;
    isFull: boolean;
    daysPerBin: number;
    bins: number[];
}

export function createStatLine(overrides: Partial<StatLine> = {}) {
    return {
        waterDrank: null,
        sleep: null,
        stress: null,
        food: null,
        ...overrides,
    } as StatLine;
}

// ---------------------------------- Statistics Functions ----------------------------------

/**
 * Creates a string to serve as the key to the database. Takes in a Date object and turns it into a key for the
 * storage.
 *
 * Key format is: "Stats-yyyy-mm-dd"
 */
function calculateDate(date: Date, stat: boolean = true) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${stat ? statPrefix : goalPrefix}${year}-${month}-${day}`;
}

/**
 * Returns the statistic data interface of the given day.
 */
export async function getStat(day: Date = new Date()) {
    const date = calculateDate(day);
    const raw = await AsyncStorage.getItem(date);

    return (raw ? JSON.parse(raw) : null) as StatLine | null;
}

/**
 * Returns the most recent set goal from the day.
 *
 * @param statName - name of the statistic you request the goal for. If null, returns the full StatLine object
 * @param day - day for which you request the goal
 * @returns Number, that contains the goal
 */
export async function getCurrentGoal(statName: string | null, day: Date = new Date()) {
    const goalDates = (await AsyncStorage.getAllKeys()).filter(
        (key) => key.startsWith(goalPrefix) && key < calculateDate(day, false)
    );

    var data: StatLine | null = null;

    if (goalDates.length == 0) {
        data = createStatLine()
    } else {

        goalDates.sort();

        const date = goalDates[-1];

        const raw = await AsyncStorage.getItem(date);
        data = raw ? JSON.parse(raw) : null;
    }

    if (data === null) {
        return null;
    }

    if (statName === null) {
        return data;
    }

    return data[statName as keyof StatLine];
}

/**
 * Sets a new goal, starting today.
 *
 * @param statName Name of the goal to change
 * @param goal new value for the goal
 */
export async function setNewGoal(statName: string, goal: number, date: Date = new Date()) {
    const today = calculateDate(date, false);

    var oldGoal = await getCurrentGoal(null);
    if (oldGoal === null || typeof oldGoal === 'number') {
        oldGoal = createStatLine();
    }
    oldGoal[statName as keyof StatLine] = goal;
    AsyncStorage.setItem(today, JSON.stringify(oldGoal));
}

/**
 * Gets all existing entries of statistics in the given date range.
 * Exclusive bound on the lower range and inclusive bound on the upper range (a < b <= c)
 */
async function getStatRange(lowerDay: Date, upperDay: Date) {
    const lowerDate = calculateDate(lowerDay);
    const upperDate = calculateDate(upperDay);

    const dates = (await AsyncStorage.getAllKeys())
        .filter((key) => key.startsWith(statPrefix) && lowerDate < key && key <= upperDate)
        .sort();

    const raw = await AsyncStorage.multiGet(dates);
    const lines = raw.map(([date, line]): [string, StatLine] => [
        date,
        line ? JSON.parse(line) : null,
    ]);

    return lines.filter(([_, val]) => val != null);
}

/**
 * Returns the data of a single statistic at the given day.
 *
 * @param statName - Internal name of the requested statistic.
 * @param day - Date object of the requested day.
 *
 * @returns A number or boolean representing the requested data
 */
export async function getNamedStat(statName: string, day: Date) {
    const line = await getStat(day);

    if (line === null) {
        return null;
    }

    return line[statName as keyof StatLine];
}

/**
 * Get all statistic lines of a given stat in a given date range.
 * Dates are exclusive on the lower date, and inclusive on the upper date.
 *
 * @param statName - Internal name of the requested statistic.
 * @param lowerDay - Date object of the first day.
 * @param upperDay - Date object of the last day.
 *
 * @returns A number or boolean representing the requested data
 */
export async function getNamedStatRange(statName: string, lowerDay: Date, upperDay: Date) {
    const lines = await getStatRange(lowerDay, upperDay);

    return lines
        .map(([date, line]): [string, number | null] => [date, line[statName as keyof StatLine]])
        .filter((item): item is [string, number] => item[1] != null);
}

/**
 * Gets the stat summary for the past 'days' time.
 *
 * @param statName - Name of the statistic to summarize.
 * @param days - Amount of days to summarize.
 *
 * @returns StatisticsSummary object containing all data
 */
export async function getStatSummary(statName: string, days: number) {
    const today = new Date();
    const lowerDay = new Date();
    lowerDay.setDate(today.getDate() - days);

    const values = await getNamedStatRange(statName, lowerDay, today);

    if (values == null) {
        return null;
    }

    const returnValue: Partial<StatisticsSummary> = { statisticName: statName };

    returnValue.total = values.reduce((Acc, [d, x], _) => Acc + +x, 0);
    returnValue.count = values.length;
    returnValue.average = returnValue.total / returnValue.count;
    returnValue.maximum = values.reduce((Acc, [d, x], _) => (Acc > +x ? Acc : +x), 0);
    returnValue.minimum = values.reduce((Acc, [d, x], _) => (Acc < +x ? Acc : +x), 0);

    returnValue.isFull = returnValue.count == days;

    return returnValue as StatisticsSummary;
}

/**
 * Creates the bins with data for a bar chart to use.
 * Shows data for the previous 'days' amount of days, in 'binCount' bins.
 *
 * @param statName - Internal name of the requested statistic.
 * @param lowerDay - Date object of the first day.
 * @param upperDay - Date object of the last day.
 * @param binCount - Amount of bins to use.
 *
 * @return StatisticsBarChart interface object with the requested data.
 */
export async function getStatBarChart(
    statName: string,
    lowerDay: Date,
    upperDay: Date,
    binCount: number
) {
    const days = dateDifference(lowerDay, upperDay);

    if (days % binCount != 0) {
        return null;
    }

    const returnValue: Partial<StatisticsBarChart> = { statisticName: statName };
    returnValue.bins = [];
    returnValue.daysPerBin = days / binCount;
    returnValue.isFull = true;

    let lowerBinDate = new Date(lowerDay);
    let upperBinDate = new Date(lowerDay);
    upperBinDate.setDate(lowerBinDate.getDate() + returnValue.daysPerBin);

    for (let i = 0; i < binCount; i++) {
        const values = await getNamedStatRange(statName, lowerBinDate, upperBinDate);

        if (values.length < returnValue.daysPerBin) {
            returnValue.isFull = false;
        }

        if (values.length !== 0) {
            returnValue.bins.push(values.reduce((Acc, [d, x], _) => Acc + +x, 0) / values.length);
        } else {
            returnValue.bins.push(0);
        }

        lowerBinDate = upperBinDate;
        upperBinDate = new Date(lowerDay);
        upperBinDate.setDate(upperBinDate.getDate() + (i + 2) * returnValue.daysPerBin);
    }

    return returnValue as StatisticsBarChart;
}

/**
 * Updates a stat, default is to update today, can be changed.
 *
 * @param statName - Internal name of the statistic that needs to be changed
 * @param change - Amount that the statistic needs to be changed, may be postitive or negative
 * @param day - Date of the line that needs to be changed, defaults to today.
 *
 * @returns true if the value was updated correctly, false if something went wrong.
 */
export async function updateStat<K extends keyof StatLine>(
    statName: K,
    change: number,
    day: Date = new Date()
) {
    const line: StatLine | null = await getStat(day);
    if (line === null || line === undefined) {
        return false;
    }

    const oldVal = line[statName];

    if (oldVal === null) {
        return false;
    }

    line[statName] = oldVal + change;

    AsyncStorage.setItem(calculateDate(day), JSON.stringify(line));
    return true;
}

/**
 * Aggregates all statistical data between given dates, only returns booleans.
 *
 *
 * The data is in a key value pair: [['<statname 1>': true, '<statname 2>': false...], ...].
 *
 * Data is ordered with the oldest pair first
 * @param lowerDate - Start date of the aggregation
 * @param upperDate - End date of the aggregation
 * @returns dictionary containing a boolean if all data is present, and the data
 */
export async function getCalender(lowerDate: Date, upperDate: Date) {
    let returnValue: [string, boolean][][] = [];
    let isFull = true;

    for (
        let currentDay = lowerDate;
        currentDay <= upperDate;
        currentDay.setDate(currentDay.getDate() + 1)
    ) {
        let dayStat = await getStat(currentDay);
        const dayGoals = await getCurrentGoal(null, currentDay);
        let today: [string, boolean][] = [];

        if (dayGoals === null || typeof dayGoals === 'number') {
            // only possible if no goal was ever set, which would be an incorrect state
            return null;
        }

        if (dayStat === null) {
            isFull = false;
            dayStat = createStatLine();
        }

        for (let key in Object.keys(dayStat)) {
            const achieved = dayStat[key as keyof StatLine] ?? -1;
            const goal = dayGoals[key as keyof StatLine] ?? 0;

            const complete = achieved <= goal;
            today.push([key, complete]);
        }

        returnValue.push(today);
    }

    return {
        isFull: isFull,
        vals: returnValue,
    };
}

/**
 * Updates a stat, default is to update today, can be changed.
 *
 * @param statName - Internal name of the statistic that needs to be changed
 * @param value - The new value to change
 * @param day - Date of the line that needs to be changed, defaults to today.
 *
 * @returns true if the value was updated correctly, false if something went wrong.
 */
export async function setStat<K extends keyof StatLine>(
    statName: K,
    value: number,
    day: Date = new Date()
) {
    const line: StatLine | null = await getStat(day);
    if (line === null || line === undefined) {
        return false;
    }

    if (line[statName] === null) {
        return false;
    }

    line[statName] = value;
    AsyncStorage.setItem(calculateDate(day), JSON.stringify(line));
    return true;
}

/**
 * Inserts a statistic into the storage. When there are no statistics saved, a new entry is made,
 * else it is inserted into the already existing statline.
 *
 * @param statName The name of the statistic to insert.
 * @param value The value to insert
 * @param day The date to insert at
 *
 * @return True if there was not data for this day and stat, false if it already existed.
 */
export async function insertStat<K extends keyof StatLine>(
    statName: K,
    value: number,
    day: Date = new Date()
) {
    let line = await getStat(day);
    if (line === null || line === undefined) {
        line = createStatLine({ [statName]: value });
    } else {
        if (line[statName] !== null) {
            return false;
        }
        line[statName] = value;
    }
    AsyncStorage.setItem(calculateDate(day), JSON.stringify(line));
    return true;
}

// ---------------------------------- Settings Functions ----------------------------------

// ------------------------------- Deprecated Water Funtions ------------------------------

// Handles water in storage. May be used as template for future objects.
export function useWater(menuOpen: boolean) {
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
        setWaterData(value);
        setWater(value);
        console.log('saved water ' + value);
    }

    // Gets water data from storage on render.
    useEffect(() => {
        async function getWater() {
            const saved_water = await getWaterData();
            setWater(saved_water);
            console.log('retrieved water ' + saved_water);
        }

        getWater();
    }, []);

    return { water, saveWater };
}

export function petContextInit() {
    const [pet, setPet] = useState(0);

    async function getPetData(): Promise<number> {
        try {
            const id = await AsyncStorage.getItem('pet_id');
            return id !== null ? parseInt(id) : 0;
        } catch (error) {
            console.error('Getting pet id went wrong', error);
            return 0;
        }
    }

    async function savePet(id: number) {
        try {
            await AsyncStorage.setItem('pet_id', JSON.stringify(id));
        } catch (error) {
            console.error('Setting pet id went wrong.', error);
        }
        console.log('saved pet id ' + id);
    }

    useEffect(() => {
        async function getPet() {
            const saved_id = await getPetData();
            setPet(saved_id);
            console.log('retrieved pet id ' + saved_id);
        }

        getPet();
    }, []);

    return { pet, setPet, savePet };
}
