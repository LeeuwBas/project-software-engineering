import { ValueZustand } from '@/lib/api/ValueState';
import { getAPI } from '@/lib/api/ApiManager';
import {
    getCalender,
    getNamedStat,
    getStatBarChart,
    insertStat,
    setStat,
    StatLine,
    updateStat,
    getCurrentGoal,
    setNewGoal,
} from '@/lib/storage';

/**
 * Loads a given statistic into the given zustand.
 *
 * @param state The state to laod into
 * @param name The name of the statistic to load
 *
 * @returns The loaded value
 * @throws Error when the value is already loaded
 */
export async function loadZustand<K extends keyof StatLine>(state: ValueZustand, name: K) {
    if (state.getState().value !== null) {
        throw Error(`${name} already loaded`);
    }

    // For the current day we can default to 0. For other days we cannot.
    const loadedValue = (await getStatistic(name)) ?? 0;

    state.getState().setValue(loadedValue);
    return loadedValue;
}

/**
 * Sets a value to the given zustand, and propagates the change to the backend storage
 *
 * @param state The state to set the value in.
 * @param name The name of the statistic.
 * @param value The value to set.
 *
 * @throws Error if the stat is not loaded.
 */
export async function setZustand<K extends keyof StatLine>(
    state: ValueZustand,
    name: K,
    value: number
) {
    if (state.getState().value === null) {
        throw Error(`Stat ${name} not loaded yet`);
    }

    state.getState().setValue(value);
    await setStatistic(name, value);
}

/**
 * Loads the given statistic from the backend storage.
 *
 * @param name the name of the statistic to load.
 * @param date the date to load the value of.
 *
 * @returns The loaded statistic
 */
export async function getStatistic<K extends keyof StatLine>(name: K, date: Date = new Date()) {
    const storage = await getNamedStat(name, date);

    if (storage !== null) {
        return storage;
    }
    const server = await loadServer(name, date);

    if (server === null) {
        return null;
    }

    const inserted = await insertStat(name, server, date);

    if (!inserted) {
        throw Error('Value set while loading from server');
    }
    return server;
}

/**
 * Loads the given goal from the backend storage.
 *
 * @param name the name of the goal to load.
 * @param date the date to load the value of.
 *
 * @returns The loaded goal
 */
export async function getGoals<K extends keyof StatLine>(name: K | null, date: Date = new Date()) {
    const storage = await getCurrentGoal(name, date);

    if (storage !== null) {
        return storage;
    }
    const server = await loadGoalServer(name, date);

    if (server === null) {
        return null;
    }

    (Object.entries(server) as [keyof StatLine, number][]).forEach(([key, val]) => {
        updateStat(key, val);
    });

    if (name !== null) {
        return server[name]
    }

    return server
}

/**
 * Sets a statistic in the backend storage.
 *
 * @param name the name of the statistic to save.
 * @param value the value to set the statistic to.
 * @param date the date to save under.
 *
 * @returns true if successful, false otherwise.
 */
export async function setStatistic<K extends keyof StatLine>(
    name: K,
    value: number,
    date: Date = new Date()
) {
    if (await setStat(name, value, date)) {
        return true;
    }

    return await insertStat(name, value, date);
}

/**
 * Increments a given statistic by a given amount.
 *
 * If the value is not cached it is loaded from the server, which defaults to 0.
 *
 * @param name the statistic to increment.
 * @param increment the amount to increment by, can be negative.
 * @param date the date to change
 *
 * @returns true if successful, false if the network is offline.
 */
export async function incrementStatistic<K extends keyof StatLine>(
    name: K,
    increment: number,
    date: Date = new Date()
) {
    if (await updateStat(name, increment, date)) {
        return true;
    }

    const server = await loadServer(name, date);

    if (server === null) {
        return false;
    }

    if (!(await insertStat(name, server + increment, date))) {
        throw Error('Value set while loading from server');
    }
    return true;
}

/**
 * Loads a barchart from the backend storage
 *
 * @param name The name of the statistic
 * @param bins The amount of bins to load
 * @param daysPerBin The amount of days per bin. If it is one and a request to the server is made, the values are cached locally.
 * @param date The date of the latest value
 *
 * @returns an array daysPerBin values corresponding with each bin.
 */
export async function getStatisticChart<K extends keyof StatLine>(
    name: K,
    bins: number,
    daysPerBin: number,
    date: Date = new Date()
) {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - bins * daysPerBin);

    const storage = await getStatBarChart(name, startDate, date, bins);

    if (storage !== null && storage.isFull) {
        return storage.bins;
    }

    const server = await loadServerChart(name, startDate, date, bins);

    if (server === null) {
        return storage?.bins ?? null;
    }

    let promise: Promise<any> = Promise.resolve();

    if (daysPerBin === 1) {
        for (let i = 0; i < server.length; i++) {
            const day = new Date(startDate);
            day.setDate(day.getDate() + i);

            promise = Promise.all([promise, insertStat(name, server[i], day)]);
        }
    }

    await promise;

    return server;
}

/**
 * Load a calendar from the backend storage. If not in local storage it is requested from the server
 *
 * @param startDate The date to start at
 * @param endDate The date to end at
 *
 * @returns The loaded calendar, or null if unloaded. The calendar might not be complete if not all data is present.
 */
export async function loadCalender(startDate: Date, endDate: Date) {
    const storage = await getCalender(startDate, endDate);

    if (storage !== null && storage.isFull) {
        return storage.vals;
    }

    const server = await loadServerCalendar(startDate, endDate);

    if (server === null) {
        return storage?.vals ?? null;
    }

    return server;
}

async function loadServerCalendar(startDate: Date, endDate: Date) {
    //TODO when on main
    return null;

    const endpoint = `/api/calendar/${startDate.toISOString()}/${endDate.toISOString()}/`;

    const result: any[] = await getAPI(endpoint);

    result.forEach((dict, index, _) => {
        const keys = Object.keys(dict);
        keys.forEach((value, ix, _) => {
            dict[value] = +dict[value];
        });
    });

    return result;
}

async function loadServerChart<K extends keyof StatLine>(
    name: K,
    startDate: Date,
    endDate: Date,
    bins: number
) {
    //TODO when on main
    return null;

    const endpoint = `/api/barchart/${name}/${startDate.toISOString()}/${endDate.toISOString()}/?bins=${bins}`;

    const result = await getAPI(endpoint);

    const bin_data = result.bins;
    const loaded: number[] = Object.keys(bin_data).map((value, index, _) => +bin_data[value]);

    return loaded;
}

async function loadServer<K extends keyof StatLine>(name: K, date: Date = new Date()) {
    //TODO when on main
    return 0;

    const endpoint = `/api/stats/${date.toISOString()}/?statName=${name}`;

    const result = await getAPI(endpoint);

    if (result === null) {
        return null;
    }

    return +result.stats[name];
}

async function loadGoalServer<K extends keyof StatLine>(name: K | null, date: Date = new Date()):
                                                            Promise<StatLine | null>{
    //TODO when on main
    return null;

    const endpoint = `/api/stats/${date.toISOString()}/?statName=${name}`;

    const result = await getAPI(endpoint);

    if (result === null) {
        return null;
    }

    // return +result.stats;
}

