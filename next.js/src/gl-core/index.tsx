// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/index.tsx
import Core from './Core';
import KI from './KI';
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
    MightyButton,
    PdfSmashUpload,
} from './components';
import {useDispatch} from './cartridges/Uberedux';

export {
    Core,
    KI,
    useSlice,
    usePrompt,
    useDispatch,
    setKeyValue,
    fetchKI,
    updatePrompt,
    PromptBuilder,
    MightyButton,
    PdfSmashUpload,
}