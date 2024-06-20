import {useState} from 'react';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

// Styles
import './App.scss';

// Components
import {FormulaInputFormulaComponent} from './components/input-formula/input-formula.component.tsx';

const queryClient = new QueryClient()

function App() {
    const [result, setResult] = useState<string | number>('');

    const onResultChangeHandler = (result: string | number): void => {
        setResult(result);
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="result">Result: {result}</div>
            <FormulaInputFormulaComponent onResult={onResultChangeHandler}/>
        </QueryClientProvider>
    )
}

export default App
