// abgeschottet-ki/next.js/src/gl-core/components/KI/fetchKI.ts

export async function fetchKI(
  prompt: string,
  onChunk: (chunk: string) => void,
  onDone: (finalOutput: string) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch('/api/gl-api/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(`Bad response: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';     // raw buffer of incoming data
    let output = '';     // accumulated KI text
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: !readerDone });

        // process complete lines
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line) {
            try {
              const json = JSON.parse(line);
              if (typeof json.response === 'string') {
                output += json.response;
                onChunk(json.response); // update UI incrementally
              }
            } catch (err) {
              console.warn('Skipping invalid line from stream:', line);
            }
          }
        }
      }
      done = readerDone;
    }

    // finished streaming
    onDone(output);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.warn('[fetchKI] aborted by user');
    } else {
      console.error('[fetchKI] error:', err);
    }
    onDone('');
  }
}
