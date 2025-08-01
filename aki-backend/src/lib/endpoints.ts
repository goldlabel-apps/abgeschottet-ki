// abgeschottet-ki/pdf-smash/src/lib/endpoints.ts

export const endpoints = {
  pdf: {
    title: 'PDF Management',
    slug: 'pdf',
    routes: {
      table: {
        title: 'Manages pdf table in aki.db',
        route: 'http://localhost:4000/pdf/table',
      },
      upload: {
        title: 'Upload PDF',
        route: 'http://localhost:4000/pdf/upload',
      },
      delete: {
        title: 'Delete PDF by id',
        route: 'http://localhost:4000/pdf/delete/',
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
