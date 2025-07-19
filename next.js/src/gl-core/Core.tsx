'use client';

import config from './config.json';
import * as React from 'react';
import {
  CssBaseline,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Theme, Icon } from './cartridges/Theme';
import { useDispatch } from './cartridges/Uberedux';
import { useSlice, setKeyValue, PromptBuilder } from '../gl-core';

// Animated dots while streaming
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

export default function Core({ title = 'Abgeschottet KI' }: any) {
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState('');
  const slice = useSlice();
  const dispatch = useDispatch();
  const { themeMode } = slice;

  async function handleSend(compiledPrompt: string) {
  if (!compiledPrompt.trim()) return;
  setError('');
  setResponse('');
  setStreaming(true);

  try {
    const res = await fetch('/api/gl-api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: compiledPrompt }),
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
    setError(err.message || 'Unknown error');
  } finally {
    setStreaming(false);
  }
}


  return (
    <Theme theme={config.themes[themeMode] as any}>
      <CssBaseline />
      

      <Box sx={{ m: 2, p: 2 }}>
        <CardHeader
          avatar={<Icon icon="ki" />}
          title={<Typography variant="h6">{title}</Typography>}
        />
        <CardContent>
          {/* Accordion for slice output */}
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<Icon icon="down" />}
              aria-controls="slice-content"
              id="slice-header"
            >
              <Typography variant="subtitle2">Uberedux</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                component="pre"
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap' }}
              >
                {JSON.stringify(slice, null, 2)}
              </Typography>
            </AccordionDetails>
          </Accordion>

          <PromptBuilder onSubmit={handleSend} />


          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {(response || streaming) && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Response:
              </Typography>
              <Typography
                variant="body1"
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
              >
                {response}
                {streaming && <TypingDots />}
              </Typography>
            </Box>
          )}

          
        </CardContent>
      </Box>
    </Theme>
  );
}
