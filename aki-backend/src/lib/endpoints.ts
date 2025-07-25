// abgeschottet-ki/pdf-smash/src/lib/endpoints.ts

export const endpoints = {
  pdf: {
    title: 'PDF',
    slug: 'pdf',
    routes: {
      upload: {
        title: 'Upload PDF',
        route: 'http://localhost:4000/pdf/upload',
      },
      read: {
        title: 'List PDFs',
        route: 'http://localhost:4000/pdf/read',
      },
      root: {
        title: 'PDF Root',
        route: 'http://localhost:4000/pdf',
      },
    },
  },
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
