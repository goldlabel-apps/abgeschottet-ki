// abgeschottet-ki/next.js/src/gl-core/actions/fetchDB.tsx
import { TUbereduxDispatch } from '../../../../gl-core/types';
import { setUbereduxKey } from '../../../../gl-core/cartridges/Uberedux';
import { showFeedback } from '../../../../gl-core';

/**
 * deletePDF
 * Calls the backend to delete a PDF by ID, then shows feedback.
 */
export const deletePDF =
  (id: string) => async (dispatch: TUbereduxDispatch) => {
    try {
      console.log(`[deletePDF] Start`, id);

      const res = await fetch(`http://localhost:4000/pdf/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await res.json();

      // Show feedback regardless of status
      dispatch(
        showFeedback({
          severity: json.severity || (res.ok ? 'success' : 'error'),
          title: json.title || (res.ok ? 'Deleted OK' : 'Delete failed'),
          description: json.data || undefined,
        })
      );

      if (!res.ok) {
        
        console.error(`[deletePDF] Backend error`, json);

        dispatch(
          showFeedback({
            severity: "error",
            title: json.title || 'Delete failed',
            description: json.data.toString() || null,
          })
        );

        dispatch(
          setUbereduxKey({
            key: 'error',
            value: json.title || 'Delete failed',
          })
        );
        return;
      }

      console.log(`[deletePDF] Deleted`, json);

      // Optional: trigger a refresh of the PDFs list in state
      // dispatch(fetchDB('pdfs'));

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[deletePDF] Error`, msg);
      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        })
      );
      dispatch(
        showFeedback({
          severity: 'error',
          title: 'Delete request failed',
          data: { error: msg },
        })
      );
    }
  };
