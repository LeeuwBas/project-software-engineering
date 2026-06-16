import { GoaledStatisticBridge, LoadableBridge, StatisticBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import { getGoals, getStatistic, getStatisticChart, loadGoalZustand, loadZustand, setGoalZustand, setZustand } from '@/lib/api/GenericStorage';

// Use the water bridge when the values need to be manipulated.
export interface WaterBridge extends GoaledStatisticBridge {}

const waterState = createNewState();
const waterGoalState = createNewState()

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

export function createWaterBridge(): LoadableBridge<WaterBridge> {
    return {
        load: () => loadZustand(waterState, 'waterDrank'),
        getRaw: async (date) => (await getStatistic('waterDrank', date ?? new Date())) ?? 0,
        set: (value) => setZustand(waterState, 'waterDrank', Math.max(Math.min(value, 100), 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('waterDrank', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        loadGoal: () => loadGoalZustand(waterGoalState, "waterDrank"),
        getGoal: async (date) => (await getGoals("waterDrank", date) ?? 0),
        setGoal: (value) => setGoalZustand(waterGoalState, "waterDrank", value),
    };
}
