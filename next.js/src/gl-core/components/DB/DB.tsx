// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/DB.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Box, CardHeader, Typography } from '@mui/material';
import { MightyButton, useDispatch, useSlice } from '../../../gl-core';
import { initDB, TableSelector } from '../DB';
import { fetchDB } from './';

export type TDB = {
  mode?: 'default' | 'icon' | null;
};

export default function DB({ mode = 'default' }: TDB) {
  const dispatch = useDispatch();
  const { db } = useSlice();

  // to make sure we only ever run init once
  const hasInitRun = useRef(false);

  useEffect(() => {
    if (!hasInitRun.current && (!db || Object.keys(db).length === 0)) {
      hasInitRun.current = true;
      dispatch(initDB());
    }
  }, [db, dispatch]);

  const handleRefresh = () => {
    // explicitly re-fetch structure and overwrite db.structure in redux
    dispatch(fetchDB('structure', 'http://localhost:4000/db/structure') as any);
  };

  if (mode === 'icon') {
    return <Box>DB icon mode</Box>;
  }

  // get the selected table value from db
  const selectedTable = db?.selectedTable || '';

  return (
    <Box>
      <CardHeader
        title={<TableSelector />}
        action={
          <MightyButton
            mode="icon"
            label="Refresh"
            icon="reset"
            variant="contained"
            onClick={handleRefresh}
          />
        }
      />
      
      {/* Output selected table */}
      {selectedTable && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Selected Table: <strong>{selectedTable}</strong>
          </Typography>
        </Box>
      )}

      {/* For debugging if needed */}
      {/* <pre>db: {JSON.stringify(db, null, 2)}</pre> */}
    </Box>
  );
}
