import {StatLine, getCurrentGoal, getStat} from '@/lib/storage'

export async function getMood() {
    const achieved = await getStat();
    const goals = await getCurrentGoal(null);

    Date()
}
