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
import { useSteps } from './api/StepBridge';
import { useStress } from './api/StressBridge';
import { useWater } from './api/WaterBridge';

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
        color: '#74ccf4',
        borderColor: '#15a4e6',
        bridge: waterBridge,
        goalConfig: {
            defaultGoal: 8,
            minGoal: 1,
            stepSize: 1,
            maxGoal: 20,
        },
    },
    {
        id: 'food',
        name: 'Meals',
        icon: Food,
        useValue: useFood,
        unit: 'meals',
        color: '#ffe396',
        borderColor: '#b47e1b',
        bridge: foodBridge,
        goalConfig: {
            defaultGoal: 3,
            minGoal: 2,
            stepSize: 1,
            maxGoal: 7,
        },
    },
    {
        id: 'sleep',
        name: 'Sleep',
        icon: Sleep,
        useValue: useSleep,
        unit: 'hours',
        color: '#ff96f6',
        borderColor: '#a21bb4',
        bridge: sleepBridge,
    },
    {
        id: 'steps',
        name: 'Walking',
        icon: Shoe,
        useValue: useSteps,
        unit: 'steps',
        color: '#b5ff00',
        borderColor: '#49e40c',
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
        color: '#ff9699',
        borderColor: '#b41b21',
        bridge: stressBridge,
    },
];
