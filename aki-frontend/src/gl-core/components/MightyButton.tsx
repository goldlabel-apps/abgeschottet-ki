// abgeschottet-ki/next.js/src/gl-core/components/MightyButton.tsx
'use client';
import React from 'react';
import {
  Button,
  IconButton,
} from '@mui/material';
import { Icon } from '../cartridges/Theme';

export type TMightyButton = {
  mode?: 'button' | 'icon' | 'listitem' | 'noicon' | null;
  disabled?: boolean;
  iconPlacement?: 'right' | 'left';
  label?: string | undefined;
  variant?: 'contained' | 'outlined' | 'text' | undefined;
  sx?: any;
  color?: any;
  icon?: string | undefined;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function MightyButton({
  mode = 'button',
  iconPlacement = 'left',
  disabled = false,
  color = 'primary',
  sx = null,
  icon = undefined,
  variant = undefined,
  label = 'No Label',
  fullWidth = false,
  onClick = () => {
    console.log('no onClick');
  },
}: TMightyButton) {

  if (mode === 'icon') {
    return (
      <IconButton color={color} onClick={onClick} disabled={disabled}>
        <Icon icon={icon as any} />
      </IconButton>
    );
  }

  return (
    <Button
      disabled={disabled}
      sx={{ ...sx, boxShadow: 0 }}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      onClick={onClick}
      startIcon={
        iconPlacement === 'left' ? <Icon icon={icon as any} /> : undefined
      }
      endIcon={
        iconPlacement === 'right' ? <Icon icon={icon as any} /> : undefined
      }
    >
      {label}
    </Button>
  );
}
