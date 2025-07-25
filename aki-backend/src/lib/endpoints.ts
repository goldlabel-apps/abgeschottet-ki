// /Users/goldlabel/GitHub/abgeschottet-ki/pdf-smash/src/lib/endpoints.ts

export const endpoints = {
  db: {
    title: 'Database',
    slug: 'db',
    routes: {
      root: {
        title: 'Database Root',
        route: 'http://localhost:4000/db',
      },

    },
  },
  pdf: {
    title: 'PDF',
    slug: 'pdf',
    routes: {
      root: {
        title: 'PDF Root',
        route: 'http://localhost:4000/pdf',
      },
    },
  },
  ki: {
    title: 'KI',
    description: 'Local LLM',
    slug: 'ki',
    routes: {
      root: {
        title: 'KI Root',
        route: 'http://localhost:4000/ki',
      },
      info: {
        title: 'KI Info',
        route: 'http://localhost:4000/ki/info',
      },
    },
  },

  test: {
    title: 'Test',
    route: 'http://localhost:4000/test',
  },

};
