// abgeschottet-ki/aki-frontend/src/gl-core/components/Dashboard/Dashboard.tsx
'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import {
//   Box,
// } from '@mui/material';
// import { 
//   useSlice, 
//   useDispatch,  
// } from '../../../gl-core';
// import {Component1} from '../Dashboard';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect as soon as this component mounts
    router.replace('/database/table/pdfs');
  }, [router]);

  return null; // nothing to show
}
