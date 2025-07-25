// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/app/api/gl-api/db/route.tsx

import { NextResponse } from 'next/server';
import { getBase } from '../getBase';

export async function GET() {
  return NextResponse.json({
    time: Date.now(),
    base: `${getBase()}/`,
    cartridges: [
      {
        title: 'Abgeschottet KI Database',
        endpoints: [
          {
            title: 'Table',
            entpoint: `${getBase()}/db/tables`,
          },
        ],
      },
    ],
  });
}
