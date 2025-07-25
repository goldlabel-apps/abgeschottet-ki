// abgeschottet-ki/next.js/src/gl-core/actions/fetchSchema.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core/cartridges/Uberedux';
import { showFeedback } from '../../../../gl-core'
/**
 * Generic fetcher that loads JSON from a URL,
 * strips unwanted keys, and stores in db.<key>.
 */
export const fetchSchema =
  (key: string, url: string) => async (dispatch: TUbereduxDispatch) => {
    // console.log(`[fetchSchema] Starting fetch for key "${key}" from URL: ${url}`);
    try {
      const res = await fetch(url);
      // console.log(`[fetchSchema] HTTP status for "${key}":`, res.status);

      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

      const rawJson = await res.json();
      // console.log(`[fetchSchema] Raw JSON for "${key}":`, rawJson);

      // Filter out unwanted top-level props
      const { version, name, baseURL, ...filteredJson } = rawJson;
      // console.log(`[fetchSchema] Filtered JSON for "${key}":`, filteredJson);

      dispatch(
        setUbereduxKey({
          key: `db.${key}`,
          value: filteredJson,
        }),
      );

      dispatch(showFeedback({
        severity: "success",
        title: "Schema fetched"
      }))

      // console.log(`[fetchSchema] Dispatched filtered data to slice at db.${key}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[fetchSchema] Error fetching "${key}":`, msg);

      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        }),
      );
    }
  };
