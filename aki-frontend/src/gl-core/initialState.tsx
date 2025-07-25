// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/initialState.tsx

import pJSON from '../../../package.json';
import config from './config.json';

export const initialState: any = {
  vs: pJSON.version,
  created_at: Date.now(),
  themes: config.themes,
  settings: {
    themeMode: 'light',
    drawerOpen: true,
  },
};