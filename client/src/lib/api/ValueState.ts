import { create, StoreApi, UseBoundStore } from 'zustand';

type ValueState = {
    value: number | null;
    setValue: (value: number) => void;
};

export type ValueZustand = UseBoundStore<StoreApi<ValueState>>;

/**
 * Creates a new ValueZustand
 *
 * @returns the created ValueZustand
 */
export function createNewState(): ValueZustand {
    return create<ValueState>((set) => ({
        value: null,
        setValue: (value) => set({ value: value }),
    }));
}

/**
 * Create a useState like object for the given zustand.
 *
 * @param state the state to create the hook for.
 */
export function useValue(state: ValueZustand) {
    return state((s) => s.value);
}
