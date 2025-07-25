'use client';

import * as React from 'react';
import {
  Typography,
  Box,
  Button,
  Stack,
  CardHeader,
} from '@mui/material';
import { usePathname } from 'next/navigation';
import { useDispatch } from '../../cartridges/Uberedux';
import { useSlice, Icon } from '../../../gl-core';
import { PromptBuilder, PDF2KI } from '../KI';

function TypingDots() {
  const [dotCount, setDotCount] = React.useState(0);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((d) => (d + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <span style={{ fontWeight: 'bold', marginLeft: 4 }}>
      {'.'.repeat(dotCount)}
    </span>
  );
}

export default function KI({ title = 'KI' }: any) {
  const [response, setResponse] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState('');
  const [controller, setController] = React.useState<AbortController | null>(null);

  const slice = useSlice();
  const dispatch = useDispatch();

  // 👉 get the current path and detect slug after /ki/
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const kiIndex = segments.indexOf('ki');
  const slug = kiIndex !== -1 && segments.length > kiIndex + 1 ? segments[kiIndex + 1] : null;

  // 👉 if we have a slug, render the PDF2KI component instead
  if (slug) {
    return (
      <Box sx={{ p: 2 }}>
        <CardHeader
          avatar={<Icon icon="ki" color="primary" />}
          title={`PDF → KI: ${slug}`}
        />
        <PDF2KI slug={slug} />
      </Box>
    );
  }

  async function handleSend(compiledPrompt: string) {
    if (!compiledPrompt.trim()) return;

    setError('');
    setResponse('');
    setStreaming(true);

    const abortController = new AbortController();
    setController(abortController);

    try {
      const res = await fetch('/api/gl-api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: compiledPrompt }),
        signal: abortController.signal,
      });

      if (!res.ok || !res.body) {
        setError('No response body');
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line);
              if (json.response) {
                setResponse((prev) => prev + json.response);
              }
            } catch (e) {
              console.error('JSON parse error', e, line);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setStreaming(false);
      setController(null);
    }
  }

  function handleCancel() {
    if (controller) controller.abort();
    setStreaming(false);
    setController(null);
    setResponse('');
    setError('');
  }

  function handleReset() {
    setResponse('');
    setError('');
  }

  return (
    <Box>
      <CardHeader
        avatar={<Icon icon="ki" color="primary" />}
        title={title}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {(response || streaming) ? (
        <>
          <Typography
            variant="body1"
            component="pre"
            sx={{ whiteSpace: 'pre-wrap', mt: 1, mb: 2 }}
          >
            {response}
            {streaming && <TypingDots />}
          </Typography>

          <Stack direction="row" spacing={2}>
            {streaming ? (
              <Button variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
            ) : (
              <Button variant="contained" onClick={handleReset}>
                Reset
              </Button>
            )}
          </Stack>
        </>
      ) : (
        <PromptBuilder onSubmit={handleSend} />
      )}
    </Box>
  );
}
