import {createStatLine, getNamedStat, StatLine} from "@/lib/storage";

export async function loadStat<K extends keyof StatLine>(name: K, date: Date = new Date()) {
    const storage = await getNamedStat(name, date)

    if (storage !== null) {
        return storage;
    }


    // TODO load from server
    const server = 0
    const statLine = createStatLine({[name]: server})

    return server
}

