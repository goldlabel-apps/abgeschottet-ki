'use client';

import * as React from 'react';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Icon } from '../../../../gl-core';

export default function RowKI({ row }: { row: any }) {
  const {
    id,
    label = '(no label)',
  } = row;

  return (
    <ListItemButton key={id} divider>
      <ListItemIcon>
        <Icon icon="ki" color="primary" />
      </ListItemIcon>
      <ListItemText
        primary={label}
      />
    </ListItemButton>
  );
}
