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
} from '../../../../gl-core';

export type TComponent1 = {
  mode?: 'default' | 'icon' | null;
};

export default function Dashboard() {
  const { db } = useSlice();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Box sx={{ p: 2 }}>
      Component1
    </Box>
  );
}
