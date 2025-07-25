// abgeschottet-ki/next.js/src/gl-core/actions/setKeyValue.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';

/**
 * Sets a key/value pair in the main Uberedux store.
 */
export const setKeyValue =
  (key: string, value: unknown) => async (dispatch: TUbereduxDispatch) => {
    try {
      dispatch(
        setUbereduxKey({
          key,
          value,
        }),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
