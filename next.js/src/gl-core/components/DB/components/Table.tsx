// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/components/Table.tsx
'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useDispatch, useSlice } from '../../../../gl-core';
import { fetchSchema } from '../';

export default function Table() {
  const dispatch = useDispatch();
  const { db } = useSlice();
  const hasFetched = React.useRef(false);

  // Fetch once if we have nothing
  React.useEffect(() => {
    const hasTableKey = db && typeof db.table !== 'undefined';
    if (!hasFetched.current && !hasTableKey) {
      hasFetched.current = true;
      console.log('[Table] No db.table found, fetching now...');
      dispatch(fetchSchema('table', 'http://localhost:4000/db/read/table/pdfs') as any);
    }
  }, [db, dispatch]);

  // Build columns dynamically from schema
  const columns: GridColDef[] = React.useMemo(() => {
    if (!db?.table?.schema) return [];

    return db.table.schema.map((col: any) => {
      return {
        field: col.name,
        headerName: col.name,
        flex: 1,
        sortable: true,
        // optionally: hide the primary key if you don't want to show it
        hide: col.primaryKey === true && col.name === 'id',
      } as GridColDef;
    });
  }, [db?.table?.schema]);

  // Use rows directly from db.table.rows
  const rows = React.useMemo(() => {
    if (!db?.table?.rows) return [];
    return db.table.rows.map((row: any) => {
      // DataGrid expects each row to have an `id` field.
      // We already have id, but ensure it exists:
      return { id: row.id, ...row };
    });
  }, [db?.table?.rows]);

  if (!db?.table) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading table data…
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {db.table.table} ({db.table.count} rows)
      </Typography>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  );
}
