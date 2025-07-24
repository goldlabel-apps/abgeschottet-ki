// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/lib/header.ts
import pJSON from '../../package.json';

const {version, name} = pJSON;

export const header = {
    version, 
    name,
    baseURL: "http://localhost:4000/",
};
