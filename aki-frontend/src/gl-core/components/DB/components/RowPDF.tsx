'use client';

/*
  RowPDF.tsx
  This component displays a single PDF entry as a row of information
  with action buttons for Edit, View, and Delete.
  Delete now opens a confirm dialog; on confirm, it dispatches deletePDF(id).
*/

import * as React from 'react';
import { 
  Box, 
  Typography, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
} from '@mui/material';
import { Icon, MightyButton, useDispatch } from '../../../../gl-core';
import { deletePDF } from '../../DB';

export default function RowPDF({ row }: { row: any }) {
  const {
    id,
    label = '(no label)',
    text = '(no text)',
  } = row;

  const dispatch = useDispatch();

  // truncate text to 100 chars with ellipsis
  const truncatedText =
    typeof text === 'string' && text.length > 100
      ? text.substring(0, 100) + '…'
      : text;

  // dialog state
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleDialogCancel = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    dispatch(deletePDF(id));
    setOpenDialog(false);
  };

  return (
    <>
      <Box
        key={id}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1,
        }}
      >
        {/* Left side: icon and text */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ mt: 0.5 }}>
            <Icon icon="pdf" color="primary" />
          </Box>
          <Box>
            <Typography variant="h6">{label}</Typography>
            <Typography variant="body2">{truncatedText}</Typography>
          </Box>
        </Box>

        {/* Right side: action buttons */}
        <Stack direction="row" spacing={1}>
          <MightyButton
            disabled
            mode="icon"
            icon="edit"
            label="Edit"
            color="primary"
            onClick={() => {}}
          />

          <MightyButton
            disabled
            mode="icon"
            icon="link"
            label="View"
            color="primary"
            onClick={() => {}}
          />

          <MightyButton
            mode="icon"
            icon="delete"
            label="Delete"
            color="primary"
            onClick={handleDeleteClick}
          />
        </Stack>
      </Box>

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={handleDialogCancel}>
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{label}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDialogConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
