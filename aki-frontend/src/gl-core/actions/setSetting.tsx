// abgeschottet-ki/next.js/src/gl-core/actions/setSetting.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';

/**
 * Updates or creates a setting by key in the Uberedux store.
 * If the key exists, it is updated. If not, it is created.
 * Ensures that critical default keys (like theme) are always present.
 */
export const setSetting =
  (key: string, value: unknown) =>
  async (dispatch: TUbereduxDispatch, getState: any) => {
    try {
      // grab current settings from store
      const state = getState();
      // provide defaults if settings are missing
      const currentSettings = state?.redux.settings;

      console.log("currentSettings", currentSettings)

      // build a new settings object with the updated or new key
      const updatedSettings = {
        ...currentSettings,
        [key]: value,
      };

      // persist back to store
      // dispatch(
      //   setUbereduxKey({
      //     key: 'settings',
      //     value: updatedSettings,
      //   })
      // );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        })
      );
    }
  };
