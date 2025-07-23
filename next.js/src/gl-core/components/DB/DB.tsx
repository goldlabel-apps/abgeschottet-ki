// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/DB.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Box, CardHeader, Typography } from '@mui/material';
import { MightyButton, useDispatch, useSlice } from '../../../gl-core';
import { initDB, TableSelector } from '../DB';
import { fetchDB, Table } from './';

export type TDB = {
  mode?: 'default' | 'icon' | null;
};

export default function DB({ mode = 'default' }: TDB) {
  const dispatch = useDispatch();
  const { db } = useSlice();

  const hasInitRun = useRef(false);

  useEffect(() => {
    if (!hasInitRun.current && (!db || Object.keys(db).length === 0)) {
      hasInitRun.current = true;
      dispatch(initDB());
    }
  }, [db, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDB('schema', 'http://localhost:4000/db/schema') as any);
  };

  if (mode === 'icon') {
    return <Box>DB icon mode</Box>;
  }

  const selectedTable = db?.selectedTable || '';

  return (
    <Box>
      <CardHeader
        title={<TableSelector />}
        // action={
        //   <MightyButton
        //     mode="icon"
        //     label="Refresh"
        //     icon="reset"
        //     variant="contained"
        //     onClick={handleRefresh}
        //   />
        // }
      />

      {selectedTable && (
        <Box sx={{}}>
          <Table />
        </Box>
      )}
    </Box>
  );
}
