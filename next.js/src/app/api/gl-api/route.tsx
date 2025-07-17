// core/app/api/gl-api/route.ts

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
            title: 'Ringfenced AI',
            entpoint: `${getBase()}/abgeschottet-ki`,
          },
        ],
      },
    ],
  });
}
