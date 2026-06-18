import Glass from '@assets/icons/module_icons/glass.svg';
import Shoe from '@assets/icons/module_icons/shoe.svg';
import Stress from '@assets/icons/module_icons/stress.svg';
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

export const MODULES = {
    water: {
        icon: Glass,
        color: '#74ccf4',
        isGoaled: true,
    },
    steps: {
        icon: Shoe,
        color: '#b5ff00',
        isGoaled: true,
    },
    stress: {
        icon: Stress,
        color: 'red',
        isGoaled: false,
    },
};
