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

/** Use the step bridge when the values need to be manipulated. */
export interface StepBridge extends GoaledStatisticBridge {}

const stepState = createNewState();
const stepGoalState = createNewState();

/**
 * A react hook for the current steps value.
 */
export function useSteps() {
    return useValue(stepState);
}

export const stepsDefault: number = 5000;

/**
 * @returns return a newly set up steps bridge.
 */
export function createStepBridge(): LoadableBridge<StepBridge> {
    return {
        load: () =>
            Promise.all([
                loadZustand(stepState, 'steps'),
                loadGoalZustand(stepGoalState, 'steps', stepsDefault),
            ]),
        useCurrent: () => useSteps(),
        set: (value) => setZustand(stepState, 'steps', Math.max(value, 0)),
        getBarChart: async (bins, daysPerBin, endDate) => {
            return (
                (await getStatisticChart('steps', bins, daysPerBin, endDate)) ??
                new Array<number>(bins).fill(0)
            );
        },
        getSummary: async (start, end) => await getStatisticSummary('steps', start, end),
        getGoal: async (date) => (await getGoals('steps', date)) ?? stepsDefault,
        setGoal: (value) => setGoalZustand(stepGoalState, 'steps', value),
        useGoal: () => useValue(stepGoalState),
    };
}
