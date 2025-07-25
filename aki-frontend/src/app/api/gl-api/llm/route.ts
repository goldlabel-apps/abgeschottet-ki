// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/app/api/gl-api/llm/route.ts

import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const upstream = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'phi3', // or your local model name
      prompt,
      stream: true,
    }),
  });

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      title: 'LLM API Endpoint',
      description: 'Handles prompt streaming to the local LLM service.',
      message: 'Use POST',
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      status: 200,
    }
  );
}
