// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/actions/thumbnail.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import { 
  showFeedback, 
  log,
} from '../../gl-core';
import {
  fetchTable,
} from '../components/DB';

/**
 * Calls the generate thumbnail endpoint
 * http://localhost:4000/pdf/thumbnail/23
 */

export const makeThumbnail =
  (id: number) => async (dispatch: TUbereduxDispatch) => {
    try {

      const res = await fetch(`http://localhost:4000/pdf/thumbnail/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Parse the JSON response
      const data = await res.json();

      // Log out the entire response object
      // console.log('[thumbnail] full response JSON:', data);
      // console.log("res.data", res.data);
      
      dispatch(showFeedback({ 
        severity: "success", 
        title: "Thumbnail created"
      }));

      dispatch(log({ 
        severity: "success", 
        title: `Made thumbnail for ${id}`
      }));

      const apiUrl = `http://localhost:4000/db/read/table/pdfs`;
      dispatch(fetchTable("pdfs", apiUrl) as any);

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      dispatch(showFeedback({ 
        severity: "error", 
        title: "Thumbnail error", 
        description: msg
      }));
      
      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        }),
      );
    }
  };
