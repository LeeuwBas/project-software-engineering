import {create} from "zustand";

type ValueState = {
    value: number | undefined;
    setValue: (value: number) => void;
};

export function createNewState() {
    return create<ValueState>((set) => ({
        value: undefined,
        setValue: (value) => set({value: value}),
    }));
}
