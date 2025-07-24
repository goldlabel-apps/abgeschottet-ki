// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/actions/initDB.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core/cartridges/Uberedux';
import { fetchDB } from '../';

/**
 * Initialize the db slice and fetch schema.
 */
export const initDB =
  () => async (dispatch: TUbereduxDispatch) => {
    try {
      console.log('ONLY ONCE PLEASE');

      // Mark as initting
      dispatch(
        setUbereduxKey({
          key: 'db.initting',
          value: true,
        }),
      );

      // Perform actual fetch
      await dispatch(fetchDB('schema', 'http://localhost:4000/db/schema') as any);
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
