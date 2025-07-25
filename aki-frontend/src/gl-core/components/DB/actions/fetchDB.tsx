// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/actions/fetchDB.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core/cartridges/Uberedux';

/**
 * Generic fetcher that loads JSON from a URL,
 * strips unwanted keys, and stores in db.<key>.
 */
export const fetchDB =
  (key: string, url: string) => async (dispatch: TUbereduxDispatch) => {
    // console.log(`[fetchDB] Starting fetch for key "${key}" from URL: ${url}`);
    try {
      const res = await fetch(url);
      // console.log(`[fetchDB] HTTP status for "${key}":`, res.status);

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const rawJson = await res.json();
      // console.log(`[fetchDB] Raw JSON for "${key}":`, rawJson);

      // Filter out unwanted top-level props
      const { version, name, baseURL, ...filteredJson } = rawJson;
      // console.log(`[fetchDB] Filtered JSON for "${key}":`, filteredJson);

      dispatch(
        setUbereduxKey({
          key: `db.${key}`,
          value: filteredJson,
        }),
      );

      // console.log(`[fetchDB] Dispatched filtered data to slice at db.${key}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[fetchDB] Error fetching "${key}":`, msg);

      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        }),
      );
    }
  };
