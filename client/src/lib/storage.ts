import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
    chosenPet: String;
}

interface StatLine {
    waterDrank: number;
}

interface StatisticsData {
    entries: number;
    Statistics: Record<string, StatLine>;
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

async function getStatSummary(statName: string, days: number) {
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




// ---------------------------------- Settings Functions ----------------------------------
