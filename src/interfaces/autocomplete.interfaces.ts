export interface IAutocompleteOption {
    name: string,
    category: string,
    value: number | string,
    id: string,
    inputs?: string,
}

export interface IAutocompleteStore {
    autocompleteOptions: IAutocompleteOption[];
    setAutocompleteOptions: (options: IAutocompleteOption[]) => void;
    addAutocompleteOption: (option: IAutocompleteOption) => void;
    removeAutocompleteOption: (option: IAutocompleteOption) => void;
}

