import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { dateDifference } from './utils';

const statPrefix = 'Stats-';
const goalPrefix = 'Goals-';
const syncDataKey = 'sync';

export interface Settings {
    chosenPet: number;
    hasDoneTutorial: boolean;
    petName: string;
    enabledModules: EnabledModules;
}

export interface EnabledModules {
    water: boolean;
    sleep: boolean;
    steps: boolean;
    stress: boolean;
    food: boolean;
}

export interface StatLine {
    water: number | null;
    sleep: number | null;
    steps: number | null;
    stress: number | null;
    food: number | null;
}

export interface StatisticsSummary {
    statisticName: keyof StatLine;
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
        water: null,
        sleep: null,
        steps: null,
        stress: null,
        food: null,
        ...overrides,
    } as StatLine;
}

export function createSettings(overrides: Partial<Settings> = {}) {
    return {
        chosenPet: 0,
        hasDoneTutorial: false,
        petName: "Alex", // Fun easter egg for James
        enabledModules: createEnabledModules(),
        ...overrides,
    } as Settings
}

export function createEnabledModules(overrides: Partial<EnabledModules> = {}) {
    return {
        water: true,
        sleep: true,
        steps: true,
        stress: true,
        food: true,
        ...overrides,
    } as EnabledModules
}

// ---------------------------------- Statistics Functions ----------------------------------

/**
 * Creates a string to serve as the key to the database. Takes in a Date object and turns it into a key for the
 * storage.
 *
 * Key format is: "Stats-yyyy-mm-dd"
 */
function calculateDate(date: Date, stat: string = statPrefix) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${stat}${year}-${month}-${day}`;
}

/**
 * Returns the statistic data interface of the given day.
 */
export async function getStat(day: Date = new Date()) {
    const date = calculateDate(day);
    return getStatOn(date);
}

/**
 * Returns the statistic data interface of the given day.
 */
async function getStatOn(day: string) {
    const raw = await AsyncStorage.getItem(day);

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
        (key) => key.startsWith(goalPrefix) && key <= calculateDate(day, goalPrefix)
    );

    let data: StatLine | null = null;

    if (goalDates.length == 0) {
        data = createStatLine();
    } else {
        goalDates.sort();
        const date = goalDates.at(-1)!;
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
 * @param date The date to set the goal for
 */
export async function setNewGoal<K extends keyof StatLine>(
    statName: K,
    goal: number,
    date: Date = new Date()
) {
    const today = calculateDate(date, goalPrefix);

    let oldGoal = await getCurrentGoal(null);
    if (oldGoal === null || typeof oldGoal === 'number') {
        oldGoal = createStatLine();
    }
    oldGoal[statName] = goal;
    AsyncStorage.setItem(today, JSON.stringify(oldGoal));
    await markSyncRequired(statName, true, date);
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
export async function getStatSummary<K extends keyof StatLine>(
    statName: K,
    start: Date,
    end: Date
) {
    const values = await getNamedStatRange(statName, start, end);

    if (values == null) {
        return null;
    }

    const returnValue: Partial<StatisticsSummary> = { statisticName: statName };

    returnValue.total = values.reduce((Acc, [d, x], _) => Acc + +x, 0);
    returnValue.count = values.length;
    returnValue.average = returnValue.total / returnValue.count;
    returnValue.maximum = values.reduce((Acc, [d, x], _) => (Acc > +x ? Acc : +x), 0);
    returnValue.minimum = values.reduce((Acc, [d, x], _) => (Acc < +x ? Acc : +x), 0);

    const fullDate = new Date(start);
    fullDate.setDate(start.getDate() + returnValue.count);
    returnValue.isFull =
        fullDate.getDate() == end.getDate() &&
        fullDate.getMonth() == end.getMonth() &&
        fullDate.getFullYear() == end.getFullYear();

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
    await markSyncRequired(statName, false, day);
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
    let returnValue: StatLine[] = [];
    let isFull = true;

    for (
        let currentDay = lowerDate;
        currentDay <= upperDate;
        currentDay.setDate(currentDay.getDate() + 1)
    ) {
        let dayStat = await getStat(currentDay);
        let dayGoals = await getCurrentGoal(null, currentDay);
        let today: StatLine = createStatLine();

        let nodata = false;

        if (dayGoals === null || typeof dayGoals === 'number') {
            // only possible if no goal was ever set, which would be an incorrect state
            nodata = true;
            dayGoals = createStatLine();
        }

        if (dayStat === null) {
            nodata = true;
            isFull = false;
            dayStat = createStatLine();
        }

        for (let key of Object.keys(dayStat) as (keyof StatLine)[]) {
            const achieved = dayStat[key] ?? -1;
            const goal = dayGoals[key] ?? 0;

            const complete = nodata ? 0 : achieved <= goal;

            if (key === 'stress') {
                today[key] = achieved;
            } else {
                const complete = achieved <= goal;
                today[key] = +complete;
            }
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
    await markSyncRequired(statName, false, day);
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
    await markSyncRequired(statName, false, day);
    return true;
}

// ---------------------------------Server Sync functions----------------------------------

/**
 * Mark some stat and date such that it should be synced to the server at the next sync moment.
 *
 * @param statName The stat to mark as sync required
 * @param isGoal Weather the stat to be synced is a goal
 * @param date The date to mark the stat as sync required.
 */
export async function markSyncRequired<K extends keyof StatLine>(
    statName: K,
    isGoal: boolean,
    date: Date = new Date()
) {
    const storageKey = syncDataKey + (isGoal ? 'Goals' : '');
    const currentSync = await AsyncStorage.getItem(storageKey);
    const dateString = calculateDate(date, '');

    if (currentSync === null) {
        // Insert if this is the first time
        AsyncStorage.setItem(storageKey, JSON.stringify({ [dateString]: new Array(statName) }));
        return;
    }

    const storage = JSON.parse(currentSync);
    const currentData = storage[dateString];

    // Add to existing data if not present,
    if (currentData) {
        const dayData: any[] = currentData;
        if (!dayData.includes(statName)) {
            dayData.push(statName);
        }
    } else {
        // else create new data for day.
        storage[dateString] = new Array(statName);
    }

    AsyncStorage.setItem(storageKey, JSON.stringify(storage));
}

/**
 * Gets all data that should be synced to the server.
 *
 * @param forGoals If this data is goal data (true) or statistic data (false, default)
 *
 * @returns The data that should be synced. In the form of a directory of the dates of the data,
 * mapped to an object with key/value pairs of all values that should be synced.
 */
export async function getSyncData(forGoals: boolean = false) {
    const storageKey = syncDataKey + (forGoals ? 'Goals' : '');
    const currentSync = await AsyncStorage.getItem(storageKey);

    if (currentSync == null) {
        return {};
    }

    const syncData: { [date: string]: { [id: string]: number } } = {};
    const storage = JSON.parse(currentSync);
    const promises: Promise<void>[] = [];
    const keysToDelete: string[] = [];

    for (const key of Object.keys(storage)) {
        const valuesForDate = storage[key];
        const dateData: { [id: string]: number } = {};
        syncData[key] = dateData;

        promises.push(
            // Load the stats for the given day
            getStatOn((forGoals ? goalPrefix : statPrefix) + key).then((stats) => {
                if (stats === null) {
                    return;
                }

                // Select all values that should be synced and are present.
                for (const statName of valuesForDate) {
                    const value = stats[statName as keyof StatLine];
                    if (value !== null) {
                        dateData[statName] = value;
                    }
                }

                keysToDelete.push(key); // Delete if we could load from storage.
            })
        );
    }

    await Promise.allSettled(promises);

    for (const key of keysToDelete) {
        delete storage[key];
    }

    AsyncStorage.setItem(storageKey, JSON.stringify(storage));
    return syncData;
}

// ---------------------------------- Settings Functions ----------------------------------

export async function getSettings(): Promise<Settings> {

    try {
        const raw = await AsyncStorage.getItem('settings');

        const val = raw ? createSettings(JSON.parse(raw)) : createSettings();
        return val
    } catch (error) {
        console.error(error);
        return createSettings();
    }
}

export async function setSettings(settings: Settings) {
    try {
        await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
        console.error(error);
    }
}

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
