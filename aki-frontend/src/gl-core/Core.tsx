// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/Core.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Box, CssBaseline, Typography } from '@mui/material';
import {
  useThemeMode,
  useSlice,
  useDispatch,
  Feedback,
  Theme,
  Shell,
} from '../gl-core';
import { initDB } from './components/DB';
import { Dashboard } from './components/Dashboard';
import { DB } from './components/DB';
import { Table } from './components/DB';
import { KI } from './components/KI';

export default function Core() {
  const pathname = usePathname();
  const themeMode = useThemeMode();
  const { db, themes } = useSlice();
  const dispatch = useDispatch();
  const hasInitRun = useRef(false);

  // initialise database if needed
  useEffect(() => {
    if (!hasInitRun.current && (!db || Object.keys(db).length === 0)) {
      hasInitRun.current = true;
      dispatch(initDB());
    }
  }, [db, dispatch]);

  // pick which content to render based on current pathname
  const renderContent = () => {
    if (!pathname) return null;
    const path = pathname.toLowerCase();

    const matchTable = path.match(/^\/database\/table\/([^/]+)/);
    if (matchTable) {
      return <Table />;
    }
    if (path.startsWith('/database')) {
      return <DB />;
    }
    if (path.startsWith('/ki')) {
      return <KI />;
    }

    return <Dashboard />;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Theme theme={themes[themeMode]}>
        <CssBaseline />
        <Feedback />
        <Shell>{renderContent()}</Shell>
      </Theme>
    </Box>
  );
}
