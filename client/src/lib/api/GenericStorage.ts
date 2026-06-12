import {getNamedStat, insertStat, setStat, StatLine, updateStat} from "@/lib/storage";
import {ValueZustand} from "@/lib/api/ValueState";


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
        throw Error(`${name} already loaded`)
    }

    const loadedValue = await getStatistic(name)
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
export async function setZustand<K extends keyof StatLine>(state: ValueZustand, name: K, value: number) {
    if (state.getState().value === null) {
        throw Error(`Stat ${name} not loaded yet`)
    }

    state.getState().setValue(value)
    await setStatistic(name, value)
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
    const storage = await getNamedStat(name, date)

    if (storage !== null) {
        return storage;
    }
    const server = await loadServer(name, date);
    const inserted = await insertStat(name, server, date)

    if (!inserted) {
        throw Error("Value set while loading from server")
    }
    return server;
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
export async function setStatistic<K extends keyof StatLine>(name: K, value: number, date: Date = new Date()) {
    if (await setStat(name, value, date)) {
        return true
    }

    return await insertStat(name, value, date)
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
 * @returns true
 */
export async function incrementStatistic<K extends keyof StatLine>(name: K, increment: number, date: Date = new Date()) {
    if (await updateStat(name, increment, date)) {
        return true
    }

    const server = await loadServer(name, date)
    if (!await insertStat(name, server + increment, date)) {
        throw Error("Value set while loading from server")
    }
    return true;
}

async function loadServer<K extends keyof StatLine>(name: K, date: Date = new Date()) {
    // TODO load from server
    return 0
}
