'use client';

import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useSlice, useDispatch } from '../../../../gl-core';
import { setTable, fetchDB } from '../';

export default function TableSelector() {
  const dispatch = useDispatch();
  const { db } = useSlice();

  const tables: string[] = db?.schema?.tables ?? [];
  const selectedFromStore = db?.selectedTable ?? '';
  const [selectedTable, setSelectedTable] = React.useState('');

  // Choose a default table when tables load or selectedFromStore changes
  React.useEffect(() => {
    if (tables.length > 0) {
      if (selectedFromStore && tables.includes(selectedFromStore)) {
        setSelectedTable(selectedFromStore);
      } else if (!selectedTable) {
        const first = tables[0];
        setSelectedTable(first);
        dispatch(setTable(first));
      }
    }
  }, [tables, selectedFromStore, selectedTable, dispatch]);

  // Refetch whenever db.selectedTable changes
  React.useEffect(() => {
    if (selectedFromStore) {
      console.log('[TableSelector] Fetching data for table:', selectedFromStore);
      dispatch(
        fetchDB('table', `http://localhost:4000/db/read/table/${selectedFromStore}`) as any
      );
    }
  }, [selectedFromStore, dispatch]);

  const handleChange = (event: any) => {
    const value = event.target.value as string;
    setSelectedTable(value);
    dispatch(setTable(value));
  };

  if (!tables || tables.length === 0) {
    return <Box sx={{ p: 2, fontStyle: 'italic' }}>No tables found.</Box>;
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
