# AKI API Routes

- db
- ki
- log
- pdf
- test

[Endpoints as object](../lib/endpoints.ts)
```javascript
export const endpoints = {
  log: {
    title: 'Log',
    slug: 'log',
    routes: {
      update: {
        title: 'Update Log',
        route: 'http://localhost:4000/log/update',
      },
      create: {
        title: 'Create Log',
        route: 'http://localhost:4000/log/create',
      },
      root: {
        title: 'Log Root',
        route: 'http://localhost:4000/log',
      },
    },
  },
  ...
```