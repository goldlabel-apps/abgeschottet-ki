// /Users/goldlabel/GitHub/abgeschottet-ki/aki-frontend/src/gl-core/components/DB/components/RowPDF.tsx
'use client';

import * as React from 'react';
import moment from 'moment';
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
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Icon, MightyButton, useDispatch, makeThumbnail } from '../../../../gl-core';
import { deletePDF } from '../../DB';

export default function RowPDF({ row }: { row: any }) {
  const {
    id,
    label = '(no label)',
    text = '(no text)',
    filesize,
    mimeType,
    fileNameOnDisk,
    created,
    updated,
    thumbnail,
  } = row;
  const dispatch = useDispatch();

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value = value / 1024;
      unitIndex++;
    }
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  const truncatedText =
    typeof text === 'string' && text.length > 100
      ? text.substring(0, 100) + '…'
      : text;

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleDeleteClick = () => setOpenDialog(true);
  const handleDialogCancel = () => setOpenDialog(false);
  const handleDialogConfirm = () => {
    dispatch(deletePDF(id));
    setOpenDialog(false);
  };

  const handleViewClick = () => {
    if (fileNameOnDisk) {
      const url = `/pdf/uploads/${fileNameOnDisk}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMakeThumbnail = () => {
    dispatch(makeThumbnail(id));
  };

  const renderRow = (label: string, value?: any) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography sx={{ minWidth: 120, mr: 2 }}>{label}:</Typography>
        <Typography sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
          {String(value)}
        </Typography>
      </Box>
    );
  };

  const showThumbnail =
    thumbnail && thumbnail.trim() !== '' && thumbnail.trim().toLowerCase() !== 'generating...';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 1,
          gap: 2,
        }}
      >
        {/* LEFT: The accordion itself */}
        <Box sx={{ flex: 1 }}>
          <Accordion sx={{ boxShadow: 0 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${id}-content`}
              id={`panel-${id}-header`}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box>
                  <Icon icon="pdf" color="primary" />
                </Box>
                <Box>
                  <Typography variant="body1">{label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created {created ? moment(created).fromNow() : '–'}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    Updated {updated ? moment(updated).fromNow() : '–'}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {truncatedText}
              </Typography>
              <Divider sx={{ mb: 2 }} />


              {/* Thumbnail card or button */}
              {showThumbnail ? (
                <Card sx={{ display: 'flex', mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{xs: 4} }>
                      <CardMedia
                        component="img"
                        sx={{ width: '100%', height: 'auto' }}
                        image={`/png/thumbnails/${thumbnail}`}
                        alt="PDF thumbnail"
                      />
                    </Grid>
                    <Grid size={{xs: 8} }>
                      <CardContent>

              {renderRow('Filesize', formatFileSize(filesize))}
              {renderRow('MIME Type', mimeType)}

                        {/* <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          Thumbnail
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: 'break-all' }}
                        >
                          {thumbnail}
                        </Typography> */}
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <MightyButton
                  sx={{ my: 2 }}
                  variant="outlined"
                  icon="photo"
                  label="Make Thumbnail"
                  color="primary"
                  onClick={handleMakeThumbnail}
                />
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* RIGHT: Action buttons */}
        <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
          <MightyButton
            mode="icon"
            icon="view"
            label="View"
            color="primary"
            onClick={handleViewClick}
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
      <Dialog maxWidth="xs" open={openDialog} onClose={handleDialogCancel}>
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{label}</strong>? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
