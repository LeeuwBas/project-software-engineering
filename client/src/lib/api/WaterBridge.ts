import { GoaledStatisticBridge, LoadableBridge } from '@/lib/api/APIBridge';
import {
    getGoals,
    getStatisticChart,
    getStatisticSummary,
    loadGoalZustand,
    loadZustand,
    setGoalZustand,
    setZustand,
} from '@/lib/api/GenericStorage';
import { createNewState, useValue } from '@/lib/api/ValueState';
import { WaterModule } from '../types';

// Use the water bridge when the values need to be manipulated.
export interface WaterBridge extends GoaledStatisticBridge {}

const waterState = createNewState();
const waterGoalState = createNewState();

/**
 * Can be used to get and subscribe to water value changes in the UI.
 *
 * Example:
 * ```tsx
 * const water = useWater() ?? 0
 * return <AppText>{water}</AppText>
 * ```
 *
 * This will update the water value whenever it is changed internally.
 */
export function useWater() {
    return useValue(waterState);
}

export const waterDefault: number = 8;

/** TODO (LeeuwBas): docstring */
export function createWaterBridge(): LoadableBridge<WaterBridge> {
    return {
        load: () =>
            Promise.all([
                loadZustand(waterState, 'water'),
                loadGoalZustand(waterGoalState, 'water', waterDefault),
            ]),
        useCurrent: () => useWater(),
        set: (value) => setZustand(waterState, 'water', Math.max(Math.min(value, 100), 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('water', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getSummary: async (start, end) => await getStatisticSummary('water', start, end),
        getGoal: async (date) => (await getGoals('water', date)) ?? waterDefault,
        setGoal: (value) => setGoalZustand(waterGoalState, 'water', value),
        useGoal: () => useValue(waterGoalState),
    };
}
