// abgeschottet-ki/next.js/src/gl-core/hooks/useSettings.tsx
/*
    Hook returning settings from the root slice 
*/
import { useSelector } from 'react-redux';
import { TRootState } from '../cartridges/Uberedux/store';

export function useSettings() {
  return useSelector((state: TRootState) => state.redux.settings);
}