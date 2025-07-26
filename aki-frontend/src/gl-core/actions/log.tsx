// abgeschottet-ki/next.js/src/gl-core/actions/log.tsx
import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import { showFeedback } from '../../gl-core';

/**
 * Logs an action to the DB
 */

export type TLog = {
  severity: "error" | "warning" | "info" | "success";
  title: string;
  description?: string;
}

export const log =
  (log: TLog) => async (dispatch: TUbereduxDispatch) => {
    try {
      // console.log("log", log);
      if (!log) return false;
      const {severity, title, description} = log;
      dispatch(showFeedback({ severity, title, description }));

      const res = await fetch(`http://localhost:4000/pdf/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });


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
