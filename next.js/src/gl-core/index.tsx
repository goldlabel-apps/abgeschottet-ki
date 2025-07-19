// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/index.tsx
import Core from './Core';
import {

    useSlice,
    usePrompt,
} from './hooks';
import {
    setKeyValue,
    updatePrompt,
    fetchKI,
} from './actions';
import {
    PromptBuilder,
} from './components';
import {useDispatch} from './cartridges/Uberedux';

export {
    Core,
    useSlice,
    usePrompt,
    useDispatch,
    setKeyValue,
    fetchKI,
    updatePrompt,
    PromptBuilder,
}