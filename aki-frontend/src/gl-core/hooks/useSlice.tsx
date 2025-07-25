// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/hooks/useSlice.tsx
/*
    Hook returning the root slice 
*/
import { useSelector } from 'react-redux';
import { TRootState } from '../cartridges/Uberedux/store';

export function useSlice() {
  return useSelector((state: TRootState) => state.redux);
}