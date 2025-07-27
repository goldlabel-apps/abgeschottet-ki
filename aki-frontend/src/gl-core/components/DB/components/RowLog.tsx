// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/components/DB/components/RowLog.tsx
'use client';

import * as React from 'react';
import {
  Alert,
  IconButton,
  Typography,
} from '@mui/material';
import { Icon } from '../../../../gl-core';

export default function RowLog({ row }: { row: any }) {
  const {
    id,
    severity,
    title,
    description,
  } = row;

  return (
      <Alert
        severity={severity}
        sx={{ mb: 1 }}
        action={
          <>
          <IconButton
            color="primary"
          >
            <Icon icon="delete" />
          </IconButton>
          <IconButton
            color="primary"
          >
            <Icon icon="hide" />
          </IconButton>
          </>
        }
      >
        {/* Render title safely */}
        <Typography variant="body1">
          {typeof title === 'object' ? JSON.stringify(title) : title}
        </Typography>

        {/* Render description safely */}
        <Typography variant="caption">
        {description && (
          <>
            {typeof description === 'object'
              ? JSON.stringify(description)
              : description}
          </>
        )}
        </Typography>
      </Alert>
  );
}
