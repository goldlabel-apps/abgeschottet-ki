// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/Core.tsx
'use client';
import config from './config.json';
import * as React from 'react';
import { CssBaseline, Box, Typography} from '@mui/material';
import {
  Theme,
} from './cartridges/Theme';

export default function Core({
  title = 'Default Title',
}: any) {
  const themeMode = "dark";
  return (
    <Theme theme={config.themes[themeMode] as any}>
      <CssBaseline />
      <Box sx={{border: "1px solid red"}}>
        <Typography>
          {title}
        </Typography>
      </Box>
    </Theme>
  );
}
