'use client';

/*
  RowPDF.tsx
  This component displays a single PDF entry as an accordion.
  The summary row shows icon, label, and truncated text only.
  The details section expands to show action buttons and the entire row object in a <pre>.
  Delete opens a confirm dialog; on confirm, it dispatches deletePDF(id).
*/

import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon, MightyButton, useDispatch } from '../../../../gl-core';
import { deletePDF } from '../../DB';

export default function RowPDF({ row }: { row: any }) {
  const { id, label = '(no label)', text = '(no text)' } = row;
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
      <Accordion sx={{ mb: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-${id}-content`}
          id={`panel-${id}-header`}
        >
          {/* Summary row: no interactive buttons */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ mt: 0.5 }}>
              <Icon icon="pdf" color="primary" />
            </Box>
            <Box>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="body2">{truncatedText}</Typography>
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          {/* Action buttons moved here to avoid nested buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
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

          {/* JSON detail */}
          <Box
            sx={{
              bgcolor: 'background.default',
              borderRadius: 1,
              p: 2,
              overflowX: 'auto',
            }}
          >
            <pre style={{ margin: 0, fontSize: '0.8rem' }}>
              {JSON.stringify(row, null, 2)}
            </pre>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onClose={handleDialogCancel}>
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{label}</strong>? This action cannot be
            undone.
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
