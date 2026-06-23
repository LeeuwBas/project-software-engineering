import { GoaledStatisticBridge, LoadableBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import {
    getGoals,
    getStatisticSummary,
    getStatisticChart,
    loadGoalZustand,
    loadZustand,
    setGoalZustand,
    setZustand,
} from '@/lib/api/GenericStorage';

// Use the food bridge when the values need to be manipulated.
export interface foodBridge extends GoaledStatisticBridge {}

const foodState = createNewState();
const foodGoalState = createNewState();

/**
 * Can be used to get and subscribe to food value changes in the UI.
 *
 * Example:
 * ```tsx
 * const food = useFood() ?? 0
 * return <AppText>{food}</AppText>
 * ```
 *
 * This will update the food value whenever it is changed internally.
 */
export function useFood() {
    return useValue(foodState);
}

export function createFoodBridge(): LoadableBridge<foodBridge> {
    return {
        load: () =>
            Promise.all([loadZustand(foodState, 'food'), loadGoalZustand(foodGoalState, 'food')]),
        useCurrent: () => useFood(),
        set: (value) => setZustand(foodState, 'food', Math.max(Math.min(value, 100), 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('food', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getSummary: async (start, end) => await getStatisticSummary('food', start, end),
        getGoal: async (date) => (await getGoals('food', date)) ?? 0,
        setGoal: (value) => setGoalZustand(foodGoalState, 'food', value),
        useGoal: () => useValue(foodGoalState),
    };
}
