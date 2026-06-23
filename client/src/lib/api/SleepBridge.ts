import { LoadableBridge, StatisticBridge } from '@/lib/api/APIBridge';
import {
    loadGoalZustand,
    loadZustand,
    setZustand
} from '@/lib/api/GenericStorage';
import { createNewState, useValue } from '@/lib/api/ValueState';

// Use the sleep bridge when the values need to be manipulated.
export interface SleepBridge extends StatisticBridge {}

const sleepState = createNewState();
const sleepGoalState = createNewState();

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
                loadZustand(sleepState, 'sleep', -1),
                loadGoalZustand(sleepGoalState, 'sleep'),
            ]),
        useCurrent: () => useSleep(),
        set: (value) => setZustand(sleepState, 'sleep', Math.max(Math.min(value, 1), -1)),
    };
}
