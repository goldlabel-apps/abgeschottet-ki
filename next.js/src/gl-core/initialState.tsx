// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/initialState.tsx

import pJSON from '../../package.json';
// import config from './config.json';

export const initialState: any = {
  version: pJSON.version,
  themeMode: 'light',
  persisted: Date.now(),
  prompt: {
    you: "You are Sempai, a software developer with 20 years experience",
    me: "I am Kohai, a junior JavaScript developer with 2 years experience",
    guidelines: "Speak like a pirate",
    query: "Good morning Sempai, How are you?"
  },
};
