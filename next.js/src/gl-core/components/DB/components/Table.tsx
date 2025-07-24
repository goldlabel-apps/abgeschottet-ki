'use client';

import * as React from 'react';
import { Box, CardHeader } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useDispatch, useSlice, MightyButton } from '../../../../gl-core';
import { fetchTable } from '../';

export default function Table() {
  const dispatch = useDispatch();
  const { db } = useSlice();

  // aktuelle Route analysieren
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const tableName = segments[segments.length - 1];

  // Daten laden
  React.useEffect(() => {
    if (tableName) {
      const apiUrl = `http://localhost:4000/db/read/table/${tableName}`;
      dispatch(fetchTable(tableName, apiUrl) as any);
    }
  }, [tableName, dispatch]);

  const handleReload = () => {
    const apiUrl = `http://localhost:4000/db/read/table/${tableName}`;
    dispatch(fetchTable(tableName, apiUrl) as any);
  };

  // Safe access auf Tabellen-Daten
  const rows = db?.tables?.[tableName]?.rows;

  return (
    <Box sx={{ p: 2 }}>
      <CardHeader
        title={tableName}
        action={
          <MightyButton
            mode="icon"
            label="Reload"
            color="primary"
            variant="outlined"
            icon="reset"
            iconPlacement="right"
            onClick={handleReload}
          />
        }
      />

      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {rows ? `rows: ${JSON.stringify(rows, null, 2)}` : 'Lade Daten…'}
      </pre>
    </Box>
  );
}
