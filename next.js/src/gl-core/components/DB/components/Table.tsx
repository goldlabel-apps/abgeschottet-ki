// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/components/Table.tsx
'use client';

import * as React from 'react';
import { Box, CardHeader, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useDispatch, useSlice, MightyButton } from '../../../../gl-core';
import { fetchTable } from '../'

export default function Table() {
  const dispatch = useDispatch();
  const { db } = useSlice();

  // grab the pathname and extract the last segment
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // remove empty
  const tableName = segments[segments.length - 1]; // last part of path

  React.useEffect(() => {
    if (tableName) {
      // console.log('fetchTable', tableName);
      const apiUrl = `http://localhost:4000/db/read/table/${tableName}`;
      dispatch(fetchTable(tableName, apiUrl) as any);
    }
  }, [tableName, dispatch]);


  const handleReload = () => {
    const apiUrl = `http://localhost:4000/db/read/table/${tableName}`;
    dispatch(fetchTable(tableName, apiUrl) as any);
  };

  return (
    <Box sx={{ p: 2 }}>
      <CardHeader 
        title={tableName}
        action={<MightyButton 
                  mode="icon"
                  label="Reload"
                  color="primary"
                  variant='outlined'
                  icon="reset"
                  iconPlacement='right'
                  onClick={handleReload}
                />}
      />
      
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        rows: {JSON.stringify(db.tables[tableName].rows, null, 2)}
      </pre>
    </Box>
  );
}
