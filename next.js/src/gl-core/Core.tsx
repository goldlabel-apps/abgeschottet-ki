'use client';

import config from './config.json';
import * as React from 'react';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Box,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  IconButton,
  // IconButton,
} from '@mui/material';
import { Theme, Icon } from './cartridges/Theme';
import { useDispatch } from './cartridges/Uberedux';
import { useSlice, DB, PdfSmashUpload } from '../gl-core';

// derive the allowed keys from your config.themes
type ThemeMode = keyof typeof config.themes;

interface CoreProps {
  title?: string;
}

export default function Core({ title = 'Abgeschottet KI' }: CoreProps) {
  const slice = useSlice();
  const dispatch = useDispatch();

  const themeMode = slice.themeMode as ThemeMode;

  return (
    <Theme theme={config.themes[themeMode]}>
      <CssBaseline />
      {/* Sticky AppBar */}
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar disableGutters>
          <CardHeader
            sx={{ flex: 1, py: 1 }}
            avatar={<IconButton><Icon icon="ki" /></IconButton>}
            title={<Typography variant="h6">{title}</Typography>}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PdfSmashUpload />
              </Box>
            }
          />
        </Toolbar>
      </AppBar>
      {/* Scrollable content */}
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // subtract AppBar height
          overflowY: 'auto',
          p: 2,
        }}
      >
        <CardContent sx={{ p: 0 }}>


          {/* Grid content */}
          <Grid container spacing={2}>
            
            <Grid size={{ xs: 12, md: 8 }}>
              <DB />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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
            </Grid>
            
          </Grid>
        </CardContent>
      </Box>
    </Theme>
  );
}
