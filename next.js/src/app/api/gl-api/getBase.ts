// core/app/gl-api/getBase.ts

export const getBase = (): string => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:1975/api/gl-api'
    : 'https://goldlabel.pro/api/gl-api';
};
