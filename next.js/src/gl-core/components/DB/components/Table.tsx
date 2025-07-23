'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { useSlice } from '../../../../gl-core'; // adjust path if needed

export default function Table() {
  const router = useRouter();
  const { db } = useSlice(); // expects db.structure.tables in your Redux slice
  
  return (
    <>Table</>
  );
}
