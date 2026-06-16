import {StatLine, getCurrentGoal, getStat} from '@/lib/storage'

export async function getMood(): Promise<number> {
    const achieved = await getStat();
    const goals = await getCurrentGoal(null);

    if (achieved === null || goals === null) {
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
        
    } else {
        return 0;
    }
    return 0;
}
