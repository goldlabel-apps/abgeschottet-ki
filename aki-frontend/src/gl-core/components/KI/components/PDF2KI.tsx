// abgeschottet-ki/next.js/src/gl-core/components/KI/components/PDF2KI.tsx
'use client';

import * as React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';
import { MightyButton, useSlice } from '../../../../gl-core';
import { prompt } from '../prompts/prompt_001';
import { fetchKI } from '../../KI';

// simple typing dots (ChatGPT-style)
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

export default function PDF2KI() {
  const { db } = useSlice();
  const pathname = usePathname();

  // derive slug from /ki/:slug
  const segments = pathname.split('/').filter(Boolean);
  const kiIndex = segments.indexOf('ki');
  const slug =
    kiIndex !== -1 && segments.length > kiIndex + 1 ? segments[kiIndex + 1] : null;

  // look up the row in pdf table
  const pdfRows = db?.tables?.['pdfs']?.rows || [];
  const matchedRow = slug ? pdfRows.find((row: any) => row.slug === slug) : null;
  const text = matchedRow?.text ?? '';

  // build prompt with text
  const promptStr = `${prompt}\n\n${text}`;

  // streaming state
  const [output, setOutput] = React.useState('');
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const abortRef = React.useRef<AbortController | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setElapsedSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleExtract = () => {
    setOutput('');
    setIsStreaming(true);
    startTimer();

    const controller = new AbortController();
    abortRef.current = controller;

    // ✅ call fetchKI directly (not via dispatch)
    fetchKI(
      promptStr,
      (chunk: string) => {
        setOutput((prev) => prev + chunk);
      },
      (finalOutput: string) => {
        setIsStreaming(false);
        abortRef.current = null;
        stopTimer();

        if (!finalOutput) {
          console.error('⚠️ No output or request aborted.');
          return;
        }

        // try {
        //   const parsed = JSON.parse(finalOutput);
        //   console.log('✅ KI completed JSON:', parsed);
        // } catch (err) {
        //   console.error('❌ KI output is not valid JSON:', err, finalOutput);
        // }
      },
      controller.signal
    );
  };

  const handleCancel = () => {
    if (abortRef.current) abortRef.current.abort();
    setIsStreaming(false);
    abortRef.current = null;
    stopTimer();
    setOutput((prev) => prev + '\n\n[Process cancelled]');
  };

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      {matchedRow ? (
        <>
          {!isStreaming ? (
            <MightyButton
              label="Extract data"
              icon="ki"
              variant="contained"
              onClick={handleExtract}
            />
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <MightyButton
                label="Cancel"
                icon="reset"
                variant="outlined"
                color="error"
                onClick={handleCancel}
              />
              <Typography variant="body2" color="text.secondary">
                Elapsed: {elapsedSeconds}s
              </Typography>
            </Stack>
          )}

          {(output || isStreaming) && (
            <pre
              style={{
                marginTop: '1rem',
                background: '#f5f5f5',
                padding: '1rem',
                borderRadius: 4,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
              }}
            >
              {output}
              {isStreaming && <TypingDots />}
            </pre>
          )}

          {!isStreaming && elapsedSeconds > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Total time: {elapsedSeconds}s
            </Typography>
          )}
        </>
      ) : (
        <Typography color="text.secondary">
          {slug
            ? `No PDF row found with slug: ${slug}`
            : 'No slug provided in URL.'}
        </Typography>
      )}
    </Box>
  );
}
