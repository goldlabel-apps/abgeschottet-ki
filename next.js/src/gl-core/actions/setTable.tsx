// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/actions/setTable.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';

/**
 * Sets the selected table in the db slice
 * Example usage: dispatch(setTable('my_table_slug'))
 */
export const setTable =
  (slug: string) => async (dispatch: TUbereduxDispatch) => {
    try {
      // update Uberedux store at db.selectedTable
      dispatch(
        setUbereduxKey({
          key: 'db.selectedTable',
          value: slug,
        }),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(setUbereduxKey({ key: 'error', value: msg }));
    }
  };
