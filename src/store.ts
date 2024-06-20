import create from 'zustand';

//Interface
import {IAutocompleteStore} from "./interfaces/autocomplete.interfaces.ts";


const useAutocompleteStore = create<IAutocompleteStore>((set) => ({
    autocompleteOptions: [],

    setAutocompleteOptions: (options) => set({ autocompleteOptions: options }),

    addAutocompleteOption: (option) =>
        set((state) => ({ autocompleteOptions: [...state.autocompleteOptions, option] })),

    removeAutocompleteOption: (option) =>
        set((state) => ({ autocompleteOptions: state.autocompleteOptions.filter((opt) => opt.id !== option.id) })),
}));

export { useAutocompleteStore };