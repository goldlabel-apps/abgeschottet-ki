// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/app/api/gl-api/route.tsx

import { NextResponse } from 'next/server';
import { getBase } from './getBase';

export async function GET() {
  return NextResponse.json({
    time: Date.now(),
    base: `${getBase()}/`,
    cartridges: [
      {
        title: 'Abgeschottet KI',
        endpoints: [
          {
            title: 'LLM',
            entpoint: `${getBase()}/llm`,
          },
          {
            title: 'Database',
            entpoint: `${getBase()}/db`,
          },
        ],
      },
    ],
  });
}
