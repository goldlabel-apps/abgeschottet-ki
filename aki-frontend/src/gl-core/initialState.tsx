// abgeschottet-ki/next.js/src/gl-core/initialState.tsx

import pJSON from '../../../package.json';
import config from './config.json';

export const initialState: any = {
  vs: pJSON.version,
  created_at: Date.now(),
  themes: config.themes,
  kiBus: {
    128: {
      lastFetched: 12342434,
      fetching: false,
      fetched: true,
      error: null,
      data: {
        title: "128 Data",
      }
    },
    129: {
      lastFetched: Date.now(),
      fetching: true,
      fetched: false,
      error: null,
      data: {
        foo: "bar",
      }
    },

  },
  settings: {
    themeMode: 'light',
    dialog: false,
    drawerOpen: true,
  },
};
