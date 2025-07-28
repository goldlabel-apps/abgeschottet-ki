import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import {
  showFeedback,
  log,
} from '../../gl-core';

export interface KIBusEntry {
  lastFetched: number;
  fetching: boolean;
  fetched: boolean;
  error: string | null;
  data: Record<string, unknown> | null;
}

/**
 * Updates or creates a bus entry for a PDF
 */
export const setKIBus = (
  id: number | string,
  value: KIBusEntry
) =>
  async (dispatch: TUbereduxDispatch, getState: any) => {
    try {
      const state = getState();
      const currentKiBus = state?.redux?.kiBus ?? {};

      const updatedKiBus = {
        ...currentKiBus,
        [id]: value,
      };

      dispatch(
        setUbereduxKey({
          key: 'kiBus',
          value: updatedKiBus,
        })
      );

      // dispatch(showFeedback({
      //   severity: 'info',
      //   title: 'KI Bus updated',
      //   description: `Updated KI state for PDF ID ${id}`,
      // }));

      dispatch(log({
        severity: 'success',
        title: 'KI Bus update',
        description: `KI Bus updated for ID ${id}`,
        data: value,
      }));

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      dispatch(
        setUbereduxKey({
          key: 'error',
          value: msg,
        })
      );
    }
  };
