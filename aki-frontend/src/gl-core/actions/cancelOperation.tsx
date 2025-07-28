// abgeschottet-ki/next.js/src/gl-core/actions/cancelOperation.tsx

import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';

/**
 * cancelOperation
 * Cancels any ongoing operation for the given ID by clearing its fetching state.
 */
export const cancelOperation =
  (id: number) => async (dispatch: TUbereduxDispatch) => {
    try {
      dispatch(
        setUbereduxKey({
          key: `kiBus.${id}.fetching`,
          value: false,
        })
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
