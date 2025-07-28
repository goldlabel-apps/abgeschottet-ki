// /Users/goldlabel/GitHub/aki/aki-frontend/src/gl-core/actions/rip.tsx
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
 * Calls the ripText endpoint with :id
 */

export const rip =
  (id: number) => async (dispatch: TUbereduxDispatch) => {
    try {
      // console.log("rip", id)

      const res = await fetch(`http://localhost:4000/pdf/rip/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      
      const { severity, title, description } = data;
      const resData = data.data;
      
      if (!resData) console.log("resData", resData);

      // dispatch(showFeedback({ 
      //   severity, 
      //   title,
      //   description,
      // }));

      // dispatch(log({ 
      //   severity: "success", 
      //   title: `Ripped ${id}`
      // }));

      dispatch(fetchTable("pdfs", `http://localhost:4000/db/read/table/pdfs`) as any);

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      dispatch(showFeedback({ 
        severity: "error", 
        title: "Rip error", 
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
