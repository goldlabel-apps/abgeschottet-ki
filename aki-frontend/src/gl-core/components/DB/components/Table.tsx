'use client';

import * as React from 'react';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Icon, useDispatch, useSlice } from '../../../../gl-core';
import { fetchTable, RowKI, RowPDF } from '../';

export default function Table() {
  const dispatch = useDispatch();
  const { db } = useSlice();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const tableName = segments[segments.length - 1];
  
  React.useEffect(() => {
    if (tableName) {
      const apiUrl = `http://localhost:4000/db/read/table/${tableName}`;
      dispatch(fetchTable(tableName, apiUrl) as any);
    }
  }, [tableName, dispatch]);

  const rows = db?.tables?.[tableName]?.rows;

  return (
    <Box sx={{  }}>

      {rows && Array.isArray(rows) && rows.length > 0 ? (
        <List>
          {rows.map((row: any, index: number) => {
            if (tableName === 'ki') {
              return <RowKI key={index} row={row} />;
            }
            if (tableName === 'pdfs') {
              return <RowPDF key={index} row={row} />;
            };
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid #eee',
                  p: 1,
                }}
              >
                <Icon icon={tableName as any} color="primary" />
                <Box sx={{ ml: 2 }}>
                  {row.label ?? '(no label)'}
                </Box>
              </Box>
            );
          })}
        </List>
      ) : (
        <Box sx={{mx: 2}}>No data yet…</Box>
      )}
    </Box>
  );
}
