// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/actions/reset.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { resetUberedux } from '../../gl-core/cartridges/Uberedux';
import { initialState } from '../initialState';

/**
 * Resets the entire Uberedux slice back to initialState,
 * then waits 333ms and redirects the browser to "/".
 */
export const reset =
  () => async (dispatch: TUbereduxDispatch) => {
    try {

      console.log("resetting Uberedux")

      // reset  Uberedux
      dispatch(resetUberedux());

      // after 333ms, redirect to "/"
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      }, 333);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
