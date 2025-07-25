// abgeschottet-ki/next.js/src/gl-core/actions/updatePrompt.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';

/**
 * Update a single key inside the prompt state
 */
export const updatePrompt =
  (key: string, value: unknown) => async (dispatch: TUbereduxDispatch) => {
    try {
      dispatch(
        setUbereduxKey({
          key: `prompt.${key}`,
          value,
        }),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        }),
      );
    }
  };
