import {FC, KeyboardEvent, useEffect, useRef, useState} from 'react';
import * as mathjs from 'mathjs';
import {useQuery} from "@tanstack/react-query";
import axios from "axios";

// Styles
import './input-formula.component.scss';

// Store
import {useAutocompleteStore} from "../../store.ts";

// Models
import {IAutocompleteOption} from '../../interfaces/autocomplete.interfaces.ts';

type TFormulaInputFormulaProps = {
    onResult?: (result: string | number) => void;
};

export const FormulaInputFormulaComponent: FC<TFormulaInputFormulaProps> = ({onResult = () => {}}: TFormulaInputFormulaProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputFormulaRef = useRef<HTMLDivElement>(null);

    const [autocompleteView, setAutocompleteView] = useState<boolean>(false);

    const autocompleteStore = useAutocompleteStore();

    // Function to fetch autocomplete options from an API endpoint
    const fetchAutocompleteOptions = async (): Promise<IAutocompleteOption[]> => {
        try {
            const response = await axios.get<IAutocompleteOption[]>('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
            return response.data;
        } catch (error) {
            console.error('Error fetching autocomplete options:', error);
            return [];
        }
    };

    // UseQuery hook to fetch and manage autocomplete options using React Query
    const {data: autocompleteOptions} = useQuery({
        queryKey: ['autocompleteOptions'],
        queryFn: fetchAutocompleteOptions,
    });

    // Effect hook to update the autocomplete options in the custom store
    useEffect(() => {
        if (autocompleteOptions && Array.isArray(autocompleteOptions)) {
            autocompleteStore.setAutocompleteOptions(autocompleteOptions);
        }
    }, [autocompleteOptions]);

    // Function to handle keyboard events and filter input
    const onValueChange = (event: KeyboardEvent<HTMLDivElement>) => {
        const allowedKeys = new RegExp('[0-9*+\\-^()\\.\\/]');

        if ((event.key.match(allowedKeys))) {
            return;
        }
        if (event.key === 'Backspace') {
            const timerId = setTimeout(() => {
                clearTimeout(timerId);
            }, 0)
            return;
        }
        event.preventDefault();
    }

    // Function to create a tag with an input element based on an autocomplete option
    const createTagWithInput = (option: IAutocompleteOption): HTMLSpanElement => {
        const formulaTag = document.createElement('span');
        formulaTag.innerHTML = option.name;
        formulaTag.classList.add('field-option');
        formulaTag.contentEditable = 'false';

        const input = document.createElement('input');
        input.dataset.value = `${option.value}`;
        input.value = `${option.value}`;
        formulaTag.append(input);

        return formulaTag;
    }

    // Function to handle selection of an autocomplete option
    const onSelectAutocompleteOption = (option: IAutocompleteOption): void => {
        if (!inputFormulaRef.current) return;

        setAutocompleteView(false);
        const formulaTag = createTagWithInput(option);

        inputFormulaRef.current.append(formulaTag);
    }

    // Function to handle click outside of the autocomplete view
    const handleClickOutside = (event: MouseEvent): void => {
        if (!wrapperRef.current || wrapperRef.current.contains(event.target as Node)) return;
        setAutocompleteView(false);
    }

    // Function to calculate the result based on the input formula
    const calculateResult = (): void => {
        const operands = Array.from(inputFormulaRef?.current?.childNodes || []).map(node => {
            if (node.nodeName === '#text') {
                return node.nodeValue;
            }
            return (node.childNodes.item(1) as HTMLInputElement).value;
        });

        const formulaString = operands.join('');

        try {
            onResult(mathjs.evaluate(formulaString));
        } catch (error) {
            onResult('Error');
        }
    }

    // Effect hook to add and remove event listener for click outside event
    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (<div ref={wrapperRef} className="input-formula">
        <div ref={inputFormulaRef}
             className="input-formula--field"
             contentEditable={true}
             data-placeholder="Please input formula..."
             onKeyDown={onValueChange}
             onFocus={() => setAutocompleteView(true)}
        />
        <button onClick={calculateResult}>Calculate</button>
        <div hidden={!autocompleteView} className="input-formula--autocomplete">
            {autocompleteOptions?.map((option, idx) => (
                <div className="autocomplete-option" key={idx}
                     onClick={() => onSelectAutocompleteOption(option)}>{option.name}</div>))}
        </div>
    </div>)
}
