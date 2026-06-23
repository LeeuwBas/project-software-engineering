import { GoaledStatisticBridge, LoadableBridge } from '@/lib/api/APIBridge';
import { createNewState, useValue } from '@/lib/api/ValueState';
import {
    getGoals,
    getStatistic,
    getStatisticChart,
    getStatisticSummary,
    loadGoalZustand,
    loadZustand,
    setGoalZustand,
    setZustand,
} from '@/lib/api/GenericStorage';

/** Use the step bridge when the values need to be manipulated. */
export interface StepBridge extends GoaledStatisticBridge {}

const stepState = createNewState();
const stepGoalState = createNewState();

/** TODO (LeeuwBas): docstring */
export function useSteps() {
    return useValue(stepState);
}

/** TODO (LeeuwBas): docstring */
export function createStepBridge(): LoadableBridge<StepBridge> {
    return {
        load: () =>
            Promise.all([loadZustand(stepState, 'steps'), loadGoalZustand(stepGoalState, 'steps')]),
        useCurrent: () => useSteps(),
        set: (value) => setZustand(stepState, 'steps', Math.max(value, 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('steps', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getSummary: async (start, end) => await getStatisticSummary('steps', start, end),
        getGoal: async (date) => (await getGoals('steps', date)) ?? 0,
        setGoal: (value) => setGoalZustand(stepGoalState, 'steps', value),
        useGoal: () => useValue(stepGoalState),
    };
}
