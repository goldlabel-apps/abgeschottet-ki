// abgeschottet-ki/next.js/src/gl-core/hooks/useKIBus.tsx
/*
    Hook returning kiBus from the root slice 
*/

import { useSelector } from 'react-redux';
import { TRootState } from '../cartridges/Uberedux/store';

export function useKIBus() {
  return useSelector((state: TRootState) => state.redux.kiBus);
}