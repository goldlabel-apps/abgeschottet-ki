'use client';

import * as React from 'react';
import { Box, CardHeader, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import { Icon, useDispatch, useSlice, MightyButton } from '../../../../gl-core';
import { fetchTable, RowKI, RowPDF } from '../';

export default function Table() {
  const dispatch = useDispatch();
  const { db } = useSlice();

  // get current route and derive tableName
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const tableName = segments[segments.length - 1];

  // fetch data whenever tableName changes
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

      {rows && Array.isArray(rows) && rows.length > 0 ? (
        <List>
          {rows.map((row: any, index: number) => {
            // choose which component to render based on tableName
            if (tableName === 'ki') {
              return <RowKI key={index} row={row} />;
            }
            if (tableName === 'pdfs') {
              return <RowPDF key={index} row={row} />;
            }

            // fallback rendering
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
        <Box>No data available…</Box>
      )}
    </Box>
  );
}
