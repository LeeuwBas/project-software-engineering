import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
import Sleep from '@assets/icons/module_icons/sleep_bed.svg';
import Food from '@assets/icons/module_icons/food.svg';
import { Dispatch, SetStateAction } from 'react';
import { SvgProps } from 'react-native-svg';

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

export interface Modules {
    water: number;
    steps: number;
}

export type ModuleProps = {
    id: string;
    icon: React.FC<SvgProps>;
    value?: number;
    setValue?: (value: number) => void;
    goal?: number;
    onPress?: () => void;
    buttonString?: string;
};

export type ModuleDefinition = {
  id: string,
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
    id: 'Steps',
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