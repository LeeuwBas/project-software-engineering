import {create, StoreApi, UseBoundStore} from "zustand";

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

export function useValue(state: UseBoundStore<StoreApi<ValueState>>) {
    return state(((s) => s.value))
}
