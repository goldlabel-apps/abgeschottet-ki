'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useSlice, useDispatch } from '../../../../gl-core';
import { setTable } from '../../../../gl-core/actions/setTable'; // adjust path if needed

export default function TableSelector() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { db } = useSlice(); // expects db.structure.tables in your Redux slice
  const tables: string[] = db?.structure?.tables ?? [];

  const [selectedTable, setSelectedTable] = React.useState('');

  // ✅ fallback: if we have tables and none selected yet, set first item as default
  React.useEffect(() => {
    if (tables.length > 0 && !selectedTable) {
      const first = tables[0];
      setSelectedTable(first);
      dispatch(setTable(first));
      router.push(`/db/tables/${first}`);
    }
  }, [tables, selectedTable, dispatch, router]);

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedTable(value);

    // ✅ update in Uberedux (db.selectedTable = value)
    dispatch(setTable(value));

    // Navigate
    if (value) {
      router.push(`/db/tables/${value}`);
    }
  };

  if (!tables || tables.length === 0) {
    return (
      <Box sx={{ p: 2, fontStyle: 'italic' }}>
        No tables found.
      </Box>
    );
  }

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <InputLabel id="table-selector-label">Select Table</InputLabel>
      <Select
        labelId="table-selector-label"
        id="table-selector"
        value={selectedTable}
        label="Select Table"
        onChange={handleChange}
      >
        {tables.map((tableName) => (
          <MenuItem key={tableName} value={tableName}>
            {tableName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
