'use client';

import * as React from 'react';
import { Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Icon, useDispatch, useSlice, FilePDF } from '../../../../gl-core';
import { fetchTable, RowKI, RowPDF, RowLog } from '../';

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

  let rows: any[] = db?.tables?.[tableName]?.rows ?? [];

  // sort by id descending
  if (Array.isArray(rows)) {
    rows = [...rows].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  return (
    <Box>
      {rows && rows.length > 0 ? (
        <List>
          {rows.map((row: any, index: number) => {
            if (tableName === 'ki') {
              return <RowKI key={row.id ?? index} row={row} />;
            }
            if (tableName === 'pdfs') {
              return <FilePDF key={row.id ?? index} data={row} />;
            }
            if (tableName === 'log') {
              return <RowLog key={row.id ?? index} row={row} />;
            }
            return (
              <Box
                key={row.id ?? index}
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
        <Box sx={{ m: 2}}>
          No records in {tableName} table
        </Box>
      )}
    </Box>
  );
}
