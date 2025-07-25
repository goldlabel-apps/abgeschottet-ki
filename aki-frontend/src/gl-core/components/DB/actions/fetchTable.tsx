// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/actions/fetchTable.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core/cartridges/Uberedux';
import { showFeedback } from '../../../../gl-core'
/**
 * Fetches table data from /db/read/table/table_name
 */
export const fetchTable =
  (tableName: string, url: string) => async (dispatch: TUbereduxDispatch) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        dispatch(
          showFeedback({
            severity: 'error',
            title: `Fetch failed: ${res.status}`,
          })
        );
        return;
      }

      const rawJson = await res.json();
      const { version, name, baseURL, ...filteredJson } = rawJson;

      // ✅ store into db.tables.<tableName>
      dispatch(
        setUbereduxKey({
          key: `db.tables.${tableName}`,
          value: filteredJson,
        })
      );

      // dispatch(showFeedback({ severity: 'success', title: `${tableName} fetched` }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[fetchTable] Error fetching "${tableName}":`, msg);

      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        })
      );
    }
  };
