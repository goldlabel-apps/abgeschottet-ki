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
} from '@mui/material';
import { Theme, Icon } from './cartridges/Theme';
import { useDispatch } from './cartridges/Uberedux';
import { useSlice, KI, PdfSmashUpload } from '../gl-core';

// derive the allowed keys from your config.themes
type ThemeMode = keyof typeof config.themes;

interface CoreProps {
  title?: string;
}

export default function Core({ title = 'Abgeschottet KI' }: CoreProps) {
  const slice = useSlice();
  const dispatch = useDispatch();

  // cast themeMode to the known union
  const themeMode = slice.themeMode as ThemeMode;

  return (
    <Theme theme={config.themes[themeMode]}>
      <CssBaseline />

      <Box sx={{ m: 2, p: 2 }}>
        <CardHeader
          avatar={<Icon icon="ki" />}
          title={<Typography variant="h6">{title}</Typography>}
        />

        <CardContent>
          {/* Accordion showing current slice state */}
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

          {/* Grid v2 layout */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PdfSmashUpload />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <KI />
            </Grid>
          </Grid>
        </CardContent>
      </Box>
    </Theme>
  );
}
