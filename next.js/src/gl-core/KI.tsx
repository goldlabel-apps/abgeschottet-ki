'use client';

import config from './config.json';
import * as React from 'react';
import {
  CssBaseline,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
} from '@mui/material';
import { Theme, Icon } from './cartridges/Theme';
import { useDispatch } from './cartridges/Uberedux';
import { useSlice, PromptBuilder } from '../gl-core';

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

export default function KI({ title = 'KI' }: any) {
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
      <Box>


        <CardContent>
          {/* Accordion for slice output */}
          

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Grid container with PromptBuilder on the left and Response on the right */}
          <Grid container spacing={2}>
            <Grid size={6}>
              <PromptBuilder onSubmit={handleSend} />
            </Grid>

            <Grid size={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  avatar={<Icon icon="ai" />}
                  title="KI Says..."
                />
                <CardContent>
                  {(response || streaming) ? (
                    <Typography
                      variant="body1"
                      component="pre"
                      sx={{ whiteSpace: 'pre-wrap', mt: 1 }}
                    >
                      {response}
                      {streaming && <TypingDots />}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Nothing yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Box>
  );
}
