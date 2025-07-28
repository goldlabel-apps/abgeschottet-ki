// abgeschottet-ki/next.js/src/gl-core/actions/log.tsx

import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import { showFeedback } from '../../gl-core';

/**
 * Logs an action to the backend log table
 */

export type TLog = {
  severity: 'error' | 'warning' | 'info' | 'success';
  title: string;
  description?: string;
  data?: any;
};

export const log =
  (log: TLog) => async (dispatch: TUbereduxDispatch) => {
    try {
      if (!log) return false;

      const res = await fetch('http://localhost:4000/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });

      const json = await res.json();

      if (!res.ok || json.severity === 'error') {
        throw new Error(json.error || 'Failed to log entry');
      }

      dispatch(
        showFeedback({
          severity: 'success',
          title: 'Log saved',
          description: `${log.title} (${json.data?.id})`,
        }),
      );
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
