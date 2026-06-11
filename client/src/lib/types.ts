// state of popups and functions to open/close them.
export interface PopupConfigs {
  menuOpen: boolean;
  changeMenu: Function;
  settingsOpen: boolean;
  changeSettings: Function;
}

export interface PetType {
  pet: number;
  setPet: Function;
  savePet: Function;
}
