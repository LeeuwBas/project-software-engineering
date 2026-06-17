// state of popups and functions to open/close them.
export interface PopupConfigs {
    popupOpen: boolean;
    menuOpen: boolean;
    changeMenu: () => void;
    settingsOpen: boolean;
    changeSettings: () => void;
    statsOpen: boolean;
    changeStats: () => void;
    changeStats: () => void;
    stressMenuOpen: boolean;
    changeStressMenu: () => void;
    sendStress: () => void;
    setSendStress: () => void;
}

export interface PetType {
    pet: number;
    setPet: Function;
    savePet: Function;
}
