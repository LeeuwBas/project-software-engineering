import { getCurrentGoal, getStat, StatLine } from '@/lib/storage'

function checkStats(achieved: StatLine, goals: StatLine, fraction: number, hour: number) {
    (Object.entries(achieved) as [keyof StatLine, number][]).forEach(
        ([key, value]) => {
            switch (key) {
                case "stress":
                    if (value !== 0) {
                        return false;
                    }
                    break;
                case "food":
                    if (hour < 14) {
                        if (value < 1) {
                            return false;
                        }
                    } else if (hour < 20) {
                        if (value < 2) {
                            return false;
                        }
                    } else {
                        if (value < 3) {
                            return false;
                        }
                    }
                    break;
                default:
                    if (value < ((goals[key] ?? 0) * fraction)) {
                        return false;
                    }
            }
        }
    );
}

export async function getMood(): Promise<number> {
    const achieved = await getStat();
    const goals = await getCurrentGoal(null);

    if (achieved === null || goals === null) {
        return 1;
    }

    if (typeof goals == "number") {
        return 1;
    }

    const hour = new Date().getHours();

    if (hour < 10) {
        if (achieved.sleep == 1) {
            return 2;
        } else {
            return 1;
        }
    } else if (hour < 22) {
        // Calculates the fraction of the waking day that has passed.
        // Waking day is defined as being from 10 to 22, so 12 hours.
        const fraction = (hour - 10) / 12;
        return +checkStats(achieved, goals, fraction, hour) + 1;
    } else {
        return 0;
    }
}
