import { getCurrentGoal, getStat } from '@/lib/storage';
import { getWeatherStatus, WeatherData } from '@/lib/weather';

// 15 minute cache so repeated quote requests dont hammer the weather api
let _weatherCache: { data: WeatherData | null; timestamp: number } | null = null;
const WEATHER_POLLING = 15 * 60 * 1000;

/**
 * Determines which quote to request based on today's stats, goals, and weather.
 * @returns `{ action, level, context }` to pass to the quote API, or `null` if a
 * request cannot be made (missing data, no valid stats).
 */
export async function calculateQuoteRequest() {
    const snap = await getTodaysSnapshot();
    if (snap === null) return null;
    const { currentStats, currentGoals } = snap;

    const {
        water: waterNow,
        sleep: sleepNow,
        steps: stepsNow,
        stress: stressNow,
        food: foodNow,
    } = currentStats;

    const {
        water: waterGoal,
        sleep: sleepGoal,
        steps: stepsGoal,
        stress: stressGoal,
        food: foodGoal,
    } = currentGoals;

    const goodWeather: boolean = await isGoodWeather();

    // Low, Medium, High boundaries
    const floors = {
        water: { med: 0.45, high: 0.99 },
        sleep: { med: 0.33, high: 0.66 },
        steps: { med: 0.33, high: 0.99 },
        stress: { med: 0.33, high: 0.66, invert: true }, // high stays good
        food: { med: 0.45, high: 0.99 },
    };

    // calculate if the progress toward the goal is low, med, or high, or null if there is no goal
    const getLevel = (
        current: number | null,
        goal: number | null,
        floors: { med: number; high: number; invert?: boolean }
    ): string | null => {
        if (current === null || goal === 0 || goal === null) return null;
        let ratio = current / goal;
        if (floors.invert ?? false) ratio = 1 - ratio;
        if (ratio < floors.med) return 'Low';
        if (ratio < floors.high) return 'Medium';
        return 'High';
    };

    const stats = [
        { action: 'Water', level: getLevel(waterNow, waterGoal, floors.water) },
        { action: 'Walk', level: getLevel(stepsNow, stepsGoal, floors.steps) },
        { action: 'Sleep', level: getLevel(sleepNow, sleepGoal, floors.sleep) },
        { action: 'Eat', level: getLevel(foodNow, foodGoal, floors.food) },
        { action: 'Stress', level: getLevel(stressNow, stressGoal, floors.stress) },
    ];

    // filter out stats with no goal
    const nonNullStats = stats.filter(
        (stat): stat is { action: string; level: string } => stat.level !== null
    );

    // figure out what the lowest progress is and filter out any goals with more progress than that
    const priority = ['Low', 'Medium', 'High'];
    const worstLevel = priority.find((level) => nonNullStats.some((stat) => stat.level === level));
    const validStats =
        worstLevel === undefined ? [] : nonNullStats.filter((stat) => stat.level === worstLevel);
    if (validStats.length === 0) {
        console.log('no valid stats found');
        return null;
    }

    // pick a random goal among the ones with the least progress.
    const worst = validStats[Math.floor(Math.random() * validStats.length)];

    // figure out if the weather is good in case we still need steps, or if we exercised in case we need more water.
    let context = 'Standard';
    if (worst.action === 'Water' && worstLevel === 'Low') {
        if (
            nonNullStats.some(
                (stat) =>
                    stat.action === 'Walk' && (stat.level === 'High' || stat.level === 'Medium')
            )
        ) {
            context = 'Exercise';
        } else if (goodWeather) context = 'Sunny';
    }

    if (worst.action === 'Walk' && worstLevel === 'Medium' && goodWeather) {
        context = 'Sunny';
    }

    const action = worst.action;
    const level = worst.level;
    return { action, level, context };
}

// grab todays stats and goals from storage
// returns null if either is unavailable or in an unexpected shape
async function getTodaysSnapshot() {
    try {
        const currentStats = await getStat(); // StatLine | null
        const currentGoals = await getCurrentGoal(null); // StatLine | number | null

        if (currentStats === null || typeof currentGoals === 'number' || currentGoals === null)
            throw Error(`stats: ${currentStats}\ngoals: ${currentGoals}`);

        return { currentStats, currentGoals };
    } catch (e) {
        console.log(`Failed to get snapshot: ${(e as Error).message}`);
    }
    return null;
}

// true if weather is clear or lightly cloudy
// caches the result for 15 minutes before re-fetching
async function isGoodWeather(): Promise<boolean> {
    const now = Date.now();
    if (_weatherCache === null || now - _weatherCache.timestamp >= WEATHER_POLLING) {
        _weatherCache = { data: await getWeatherStatus(), timestamp: now };
    }
    if (!_weatherCache.data) return false;
    return _weatherCache.data.id >= 800 && _weatherCache.data.id <= 802;
}
