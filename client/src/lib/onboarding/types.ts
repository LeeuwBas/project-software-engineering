import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
import Sleep from '@assets/icons/module_icons/sleep_bed.svg';
import Food from '@assets/icons/module_icons/food.svg';
import { createWaterBridge } from '@/lib/api/WaterBridge';
import { createFoodBridge } from '@/lib/api/FoodBridge';
import { createStepBridge } from '@/lib/api/StepBridge';

export type OnboardingStep =
  | 'pet-selection'
  | 'pet-naming'
  | 'account'
  | 'module-selection'
  | 'module-config';

export type ModuleDefinition = {
  id: string;
  key: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
};

export const MODULES: ModuleDefinition[] = [
  {
    id: 'Water',
    key: 'water',
    icon: Glass,
    color: '#74ccf4',
    borderColor: '#15a4e6',
  },
  {
    id: 'Walking',
    key: 'steps',
    icon: Shoe,
    color: '#81c381',
    borderColor: '#22a022',
  },
  {
    id: 'Stress',
    key: 'stress',
    icon: Stress,
    color: '#ff9699',
    borderColor: '#b41b21',
  },
  {
    id: 'Sleep',
    key: 'sleep',
    icon: Sleep,
    color: '#ff96f6',
    borderColor: '#a21bb4',
  },
  {
    id: 'Meals',
    key: 'food',
    icon: Food,
    color: '#ffe396',
    borderColor: '#b47e1b',
  },
];

export type GoalBridge = {
  setGoal: (value: number) => void;
};

export type ConfigDefinition = {
  key: string;
  label: string;
  unit: string;
  bridge: (() => GoalBridge);
  defaultGoal: number;
  minGoal: number;
  stepSize: number;
  maxGoal: number;
};

export const GOAL_MODULES: ConfigDefinition[] = [
  {
    key: 'water',
    label: 'Water',
    unit: 'glasses',
    bridge: createWaterBridge,
    defaultGoal: 8,
    minGoal: 1,
    stepSize: 1,
    maxGoal: 20,
  },
  {
    key: 'steps',
    label: 'Walking',
    unit: 'steps',
    bridge: createStepBridge,
    defaultGoal: 5000,
    minGoal: 1000,
    stepSize: 1000,
    maxGoal: 25000,
  },
  {
    key: 'food',
    label: 'Meals',
    unit: 'meals',
    bridge: createFoodBridge,
    defaultGoal: 3,
    minGoal: 2,
    stepSize: 1,
    maxGoal: 7,
  },
];