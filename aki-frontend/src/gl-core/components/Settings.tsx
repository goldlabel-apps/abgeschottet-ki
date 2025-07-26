// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/components/Settings.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import {
  useSettings,
  useDispatch,
  Icon,
  setSetting,
  MightyButton,
} from '../../gl-core';

export default function Settings() {
  const settings = useSettings();
  const { dialog } = settings; // boolean controlling open/close
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(setSetting('dialog', true));
  };

  const handleClose = () => {
    dispatch(setSetting('dialog', false));
  };

  return (
    <>
      <MightyButton 
        mode="icon"
        icon="settings"
        color={"primary"}
        onClick={handleOpen}
      />
    
      <Dialog
        open={Boolean(dialog)}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Icon icon="settings" />
            <Typography variant="h6">Settings</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            Here you can configure application preferences.
          </Typography>
          <pre style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(settings, null, 2)}
          </pre>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
