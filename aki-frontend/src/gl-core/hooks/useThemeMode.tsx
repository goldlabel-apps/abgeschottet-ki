// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/hooks/themeMode.tsx
/*
    Hook returning themeMode from the root slice 
*/
import { useSelector } from 'react-redux';
import { TRootState } from '../cartridges/Uberedux/store';

export function useThemeMode() {
  return useSelector((state: TRootState) => state.redux.settings.themeMode);
}