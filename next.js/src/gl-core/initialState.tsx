// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/initialState.tsx

import pJSON from '../../package.json';
// import config from './config.json';

export const initialState: any = {
  themeMode: 'light',
  persisted: Date.now(),
  prompt: {
    you: "",
    me: "",
    guidelines: "",
    query: ""
  },
};
