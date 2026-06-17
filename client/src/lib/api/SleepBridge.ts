import { GoaledStatisticBridge, LoadableBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import { getGoals, getStatistic, getStatisticChart, loadGoalZustand, loadZustand, setGoalZustand, setZustand } from '@/lib/api/GenericStorage';

// Use the sleep bridge when the values need to be manipulated.
export interface sleepBridge extends GoaledStatisticBridge {}

const sleepState = createNewState();
const sleepGoalState = createNewState()

/**
 * Can be used to get and subscribe to sleep value changes in the UI.
 *
 * Example:
 * ```tsx
 * const sleep = useWater() ?? 0
 * return <AppText>{sleep}</AppText>
 * ```
 *
 * This will update the sleep value whenever it is changed internally.
 */
export function usesleep() {
    return useValue(sleepState);
}

export function createsleepBridge(): LoadableBridge<WaterBridge> {
    return {
        load: () => Promise.all([loadZustand(sleepState, 'water'), loadGoalZustand(waterGoalState, "water")]),
        getRaw: async (date) => (await getStatistic('sleep', date ?? new Date())) ?? 0,
        set: (value) => setZustand(sleepState, 'water', Math.max(Math.min(value, 100), 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('sleep', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getGoal: async (date) => (await getGoals("sleep", date) ?? 0),
        setGoal: (value) => setGoalZustand(sleepGoalState, "water", value),
    };
}
