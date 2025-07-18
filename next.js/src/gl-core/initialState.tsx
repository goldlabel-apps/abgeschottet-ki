// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/initialState.tsx

import pJSON from '../../package.json';
// import config from './config.json';

export const initialState: any = {
  themeMode: 'dark',
  version: pJSON.version,
  persisted: Date.now()
};
