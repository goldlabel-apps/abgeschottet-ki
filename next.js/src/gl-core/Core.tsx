// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/Core.tsx
'use client';
import config from './config.json';
import * as React from 'react';
import { 
  CssBaseline,
  Card,
  CardHeader,
  Typography,
} from '@mui/material';
import {
  Theme,
  Icon,
} from './cartridges/Theme';

export default function Core({
  title = 'Abgeschottet KI',
}: any) {
  const themeMode = "dark";
  return (
    <Theme theme={config.themes[themeMode] as any}>
      <CssBaseline />
      <Card sx={{}}>
        <CardHeader 
          avatar={<Icon icon="ki" />}
          title={<Typography variant='h6'>
                  {title}
                </Typography>}
        />
        {/*  */}
      </Card>
    </Theme>
  );
}
