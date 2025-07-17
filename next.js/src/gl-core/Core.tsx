'use client';

import config from './config.json';
import * as React from 'react';
import {
  CssBaseline,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Theme, Icon } from './cartridges/Theme';

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
  const themeMode = 'light';
  const [prompt, setPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState('');

  async function handleSend() {
    if (!prompt.trim()) return;
    setError('');
    setResponse('');
    setStreaming(true);

    try {
      const res = await fetch('/api/gl-api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
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
          buffer = lines.pop() || ''; // keep any incomplete line

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
      <Card sx={{ m: 2, p: 2 }}>
        <CardHeader
          avatar={<Icon icon="ki" />}
          title={
            <Typography variant="h6">
              {title}
            </Typography>
          }
        />
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Enter your prompt"
              variant="outlined"
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={streaming || !prompt.trim()}
            >
              Send
            </Button>
          </Box>

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
      </Card>
    </Theme>
  );
}
