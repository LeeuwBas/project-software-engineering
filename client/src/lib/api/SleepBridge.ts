import { GoaledStatisticBridge, LoadableBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import { getGoals, getStatistic, getStatisticChart, loadGoalZustand, loadZustand, setGoalZustand, setZustand } from '@/lib/api/GenericStorage';

// Use the sleep bridge when the values need to be manipulated.
export interface sleepBridge extends StatisticBridge {}

const sleepState = createNewState();
const sleepGoalState = createNewState()

/**
 * Can be used to get and subscribe to sleep value changes in the UI.
 *
 * Example:
 * ```tsx
 * const sleep = useSleep() ?? 0
 * return <AppText>{sleep}</AppText>
 * ```
 *
 * This will update the sleep value whenever it is changed internally.
 */
export function useSleep() {
    return useValue(sleepState);
}

export function createSleepBridge(): LoadableBridge<SleepBridge> {
    return {
        load: () =>
            Promise.all([
                loadZustand(sleepState, 'sleep'),
                loadGoalZustand(sleepGoalState, 'sleep'),
            ]),
        useCurrent: () => useSleep(),
        set: (value) => setZustand(sleepState, 'sleep', Math.max(Math.min(value, 100), 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('sleep', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getSummary: async (start, end) => await getStatisticSummary('sleep', start, end),
    };
}
