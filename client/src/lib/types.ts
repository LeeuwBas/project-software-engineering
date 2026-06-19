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

export interface GoalModules {
    water: number;
    steps: number;
    food: number;
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
