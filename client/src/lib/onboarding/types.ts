export type OnboardingStep =
    | 'pet-selection'
    | 'pet-naming'
    | 'account'
    | 'module-selection'
    | 'module-config';

// export type GoalBridge = {
//     setGoal: (value: number) => void;
// };

// export type ConfigDefinition = {
//     key: string;
//     label: string;
//     unit: string;
//     bridge: () => GoalBridge;
//     defaultGoal: number;
//     minGoal: number;
//     stepSize: number;
//     maxGoal: number;
// };

// export const GOAL_MODULES: ConfigDefinition[] = [
//     {
//         key: 'water',
//         label: 'Water',
//         unit: 'glasses',
//         bridge: createWaterBridge,
//         defaultGoal: 8,
//         minGoal: 1,
//         stepSize: 1,
//         maxGoal: 20,
//     },
//     {
//         key: 'steps',
//         label: 'Walking',
//         unit: 'steps',
//         bridge: createStepBridge,
//         defaultGoal: 5000,
//         minGoal: 1000,
//         stepSize: 1000,
//         maxGoal: 25000,
//     },
//     {
//         key: 'food',
//         label: 'Meals',
//         unit: 'meals',
//         bridge: createFoodBridge,
//         defaultGoal: 3,
//         minGoal: 2,
//         stepSize: 1,
//         maxGoal: 7,
//     },
// ];
