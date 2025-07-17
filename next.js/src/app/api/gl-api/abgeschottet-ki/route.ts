// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/app/api/gl-api/abgeschottet-ki/route.ts

import { NextResponse } from 'next/server';
import { getBase } from '../getBase';

export async function GET() {
  return NextResponse.json({
    time: Date.now(),
    base: `${getBase()}/`,
    cartridge: 'abgeschottet-ki',
  });
}
