import { LoadableBridge, StatisticBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import { getStatistic, getStatisticChart, loadZustand, setZustand } from '@/lib/api/GenericStorage';

// Use the water bridge when the values need to be manipulated.
export interface StressBridge extends StatisticBridge {}

const StressState = createNewState();

/**
 * Can be used to get and subscribe to stress value changes in the UI.
 *
 * Example:
 * ```tsx
 * const stress = useStress() ?? 0
 * return <AppText>{stress}</AppText>
 * ```
 *
 * This will update the water value whenever it is changed internally.
 */
export function useStress() {
    return useValue(StressState);
}

export function createWaterBridge(): LoadableBridge<StressBridge> {
    return {
        load: () => loadZustand(StressState, 'stress'),
        getRaw: async (date) => (await getStatistic('stress', date ?? new Date())) ?? 0,
        set: (value) => setZustand(StressState, 'stress', Math.max(Math.min(value, 100), 0)),
    };
}
