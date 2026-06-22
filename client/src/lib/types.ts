import { Dispatch, SetStateAction } from 'react';
import { SvgProps } from 'react-native-svg';

/** TODO (buenk, ZJWeng, hfgieter, LeeuwBas) docstring, also {@link useAppContext} in it. Make sure both docstrings for this and useAppContext
 * are well made, they're pretty important.
 */
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

/** TODO (ZJWeng): docstring */
export interface PetType {
    pet: number;
    setPet: Function;
    savePet: Function;
}

/** TODO (ZJWeng): docstring */
export interface GoalModules {
    water: number;
    steps: number;
    food: number;
}

/** TODO (ZJWeng): docstring */
export type ModuleProps = {
    id: string;
    icon: React.FC<SvgProps>;
    value?: number;
    setValue?: (value: number) => void;
    goal?: number;
    onPress?: () => void;
    buttonString?: string;
};
