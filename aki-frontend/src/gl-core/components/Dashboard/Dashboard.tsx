// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/components/Dashboard/Dashboard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
} from '@mui/material';
import { 
  useSlice, 
  useDispatch,  
} from '../../../gl-core';
import {Component1} from '../Dashboard';

export type TDashboard = {
  mode?: 'default' | 'icon' | null;
};

export default function Dashboard() {
  const { db } = useSlice();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Box sx={{ p: 2 }}>
      Dashboard
      <Component1 />
    </Box>
  );
}
