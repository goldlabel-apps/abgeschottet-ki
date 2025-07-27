// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/components/Settings.tsx
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemButton,
  ListItemIcon,
  Box,
  Typography,
  ListItemText,
} from '@mui/material';
import {
  useSettings,
  useDispatch,
  Icon,
  setSetting,
  MightyButton,
  reset,
} from '../../gl-core';

export default function Settings() {
  const settings = useSettings();
  const { dialog } = settings; // boolean controlling open/close
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(reset());
    handleClose();
  }

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
            <Typography variant="h6">
              Settings
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{mb: 2}}>
            Here you can configure application preferences.
          </Typography>
          {/* <pre style={{ fontSize: '0.8rem', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(settings, null, 2)}
          </pre> */}


          <ListItemButton onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('http://localhost:4000/', '_blank');
            }
          }}>
            <ListItemIcon
              sx={{
                mr: 2,
                justifyContent: 'center',
              }}
            >
              <Icon icon={"api"} color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={"API"}
              secondary={"The AKI programatic interface"}
            />
          </ListItemButton>


          <ListItemButton onClick={handleReset}>
            <ListItemIcon
              sx={{
                mr: 2,
                justifyContent: 'center',
              }}
            >
              <Icon icon={"reset"} color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={"Reset to Factory Settings"}
              secondary={"Reset. Restart. Clean slate"}
            />
          </ListItemButton>

        </DialogContent>

        <DialogActions>
          <MightyButton 
            label="OK"
            variant="contained"
            icon="tick"
            iconPlacement='right'
            onClick={handleClose}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
