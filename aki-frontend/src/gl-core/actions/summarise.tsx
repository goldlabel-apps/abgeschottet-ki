import { TUbereduxDispatch } from '../../gl-core/types';
import { setUbereduxKey } from '../../gl-core/cartridges/Uberedux';
import {
  showFeedback,
  log,
  setKIBus,
} from '../../gl-core';
import {
  fetchTable,
} from '../components/DB';

export const summarise =
  (id: number) => async (dispatch: TUbereduxDispatch) => {
    const now = Date.now();

    // Set KI bus: fetching started
    dispatch(setKIBus(id, {
      lastFetched: now,
      fetching: true,
      fetched: false,
      error: null,
      data: null,
    }));

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

      dispatch(showFeedback({ severity, title, description }));

      // Update KI bus: fetching complete
      dispatch(setKIBus(id, {
        lastFetched: Date.now(),
        fetching: false,
        fetched: true,
        error: null,
        data: resData,
      }));

      dispatch(fetchTable("pdfs", `http://localhost:4000/db/read/table/pdfs`) as any);
      dispatch(log({
        severity: "success",
        title: `Summary created`,
        description: "",
        data: resData,
      }));

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      // Update KI bus: error state
      dispatch(setKIBus(id, {
        lastFetched: Date.now(),
        fetching: false,
        fetched: false,
        error: msg,
        data: null,
      }));

      dispatch(showFeedback({
        severity: "error",
        title: "Summarise error",
        description: msg,
      }));

      dispatch(setUbereduxKey({
        key: 'error',
        value: msg,
      }));
    } finally {
      dispatch(setUbereduxKey({ key: 'summariseLoading', value: false }));
    }
  };
