import Food from '@assets/icons/module_icons/food.svg';
import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Sleep from '@assets/icons/module_icons/sleep_bed.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
import { Dispatch, SetStateAction } from 'react';
import { SvgProps } from 'react-native-svg';
import {
    foodBridge,
    GoaledStatisticBridge,
    sleepBridge,
    StatisticBridge,
    stepsBridge,
    stressBridge,
    waterBridge,
} from './api/APIBridge';
import { useFood } from './api/FoodBridge';
import { useSleep } from './api/SleepBridge';
import { useStress } from './api/StressBridge';
import { useWater } from './api/WaterBridge';
import useStepValue from './GetSteps';

// state of popups and functions to open/close them.
export interface PopupConfigs {
    popupOpen: boolean;
    menuOpen: boolean;
    changeMenu: () => void;
    settingsOpen: boolean;
    changeSettings: () => void;
    statsOpen: boolean;
    changeStats: () => void;
    stressMenuOpen: boolean;
    changeStressMenu: () => void;
    sendStress: () => void;
    setSendStress: Dispatch<SetStateAction<() => void>>;
}

export interface PetType {
    pet: number;
    setPet: Function;
    savePet: Function;
}

// Uses draft values instead of actual stored values.
// Only to be used in Menu.tsx and Module.tsx
export type MenuConfig = {
    value?: number;
    setValue?: (value: number) => void;
    goal?: number;
    onPress?: () => void;
    buttonString?: string;
};

export interface GoalConfig {
    defaultGoal: number;
    minGoal: number;
    maxGoal: number;
    stepSize: number;
}

export type ModuleId = 'water' | 'steps' | 'stress' | 'sleep' | 'food';

export interface NonGoaledModule {
    id: ModuleId;
    name: string;
    icon: React.FC<SvgProps>;
    useValue: () => number | null;
    unit: string;
    color: string;
    borderColor: string;
    bridge: StatisticBridge;
    menuConfig?: MenuConfig;
}

export interface GoaledModule {
    id: ModuleId;
    name: string;
    icon: React.FC<SvgProps>;
    useValue: () => number | null;
    unit: string;
    color: string;
    borderColor: string;
    bridge: GoaledStatisticBridge;
    goalConfig: GoalConfig;
    menuConfig?: MenuConfig;
}

export type ModuleDefinition = GoaledModule | NonGoaledModule;

export const MODULES: ModuleDefinition[] = [
    {
        id: 'water',
        name: 'Water',
        icon: Glass,
        useValue: useWater,
        unit: 'glasses',
        color: '#aed8eb',
        borderColor: '#5abce8',
        bridge: waterBridge,
        goalConfig: {
            defaultGoal: 8,
            minGoal: 1,
            stepSize: 1,
            maxGoal: 20,
        },
    },
    {
        id: 'steps',
        name: 'Walking',
        icon: Shoe,
        useValue: useStepValue,
        unit: 'steps',
        color: '#a5d9a5',
        borderColor: '#69d669',
        bridge: stepsBridge,
        goalConfig: {
            defaultGoal: 5000,
            minGoal: 1000,
            maxGoal: 25000,
            stepSize: 1000,
        },
    },
    {
        id: 'stress',
        name: 'Stress',
        icon: Stress,
        useValue: useStress,
        unit: 'cortisol',
        color: '#fcada3',
        borderColor: '#f67788',
        bridge: stressBridge,
    },
    {
        id: 'sleep',
        name: 'Sleep',
        icon: Sleep,
        useValue: useSleep,
        unit: 'hours',
        color: '#bb9cd6',
        borderColor: '#a772d6',
        bridge: sleepBridge,
    },
    {
        id: 'food',
        name: 'Meals',
        icon: Food,
        useValue: useFood,
        unit: 'meals',
        color: '#fcdf8d',
        borderColor: '#f7cc52',
        bridge: foodBridge,
        goalConfig: {
            defaultGoal: 3,
            minGoal: 2,
            stepSize: 1,
            maxGoal: 7,
        },
    },
];

export interface BarType {
    id: ModuleId;
    icon: React.FC<SvgProps>;
    value: number;
    goal: number;
    color: string;
    borderColor: string;
}
