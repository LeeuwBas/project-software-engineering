// state of popups and functions to open/close them.
export interface PopupConfigs {
    popupOpen: boolean;
    menuOpen: boolean;
    changeMenu: Function;
    settingsOpen: boolean;
    changeSettings: Function;
    statsOpen: boolean;
    changeStats: Function;
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
