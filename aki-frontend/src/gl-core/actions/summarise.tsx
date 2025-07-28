// /src/gl-core/actions/summarise.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import { 
  showFeedback, 
} from '../../gl-core';
import {
  fetchTable,
} from '../components/DB';

export const summarise =
  (id: number) => async (dispatch: TUbereduxDispatch) => {
    try {
      dispatch(setUbereduxKey({ key: 'summariseLoading', value: true }));

      const res = await fetch(`http://localhost:4000/ki/summarise/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      const { severity, title, description, data: resData } = data;

      dispatch(showFeedback({ 
        severity, 
        title,
        description,
      }));

      dispatch(fetchTable("pdfs", `http://localhost:4000/db/read/table/pdfs`) as any);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      dispatch(showFeedback({ 
        severity: "error", 
        title: "Summarise error", 
        description: msg,
      }));

      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        }),
      );
    } finally {
      dispatch(setUbereduxKey({ key: 'summariseLoading', value: false }));
    }
  };
