// abgeschottet-ki/next.js/src/gl-core/hooks/useSlice.tsx
/*
    Hook returning prompt from the root slice 
*/
import { useSelector } from 'react-redux';
import { TRootState } from '../cartridges/Uberedux/store';

export function usePrompt() {
  return useSelector((state: TRootState) => state.redux.prompt);
}