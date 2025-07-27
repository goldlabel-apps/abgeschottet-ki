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
  Skeleton,
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
    if (!id) {
      console.warn('No ID for makeThumbnail');
      return;
    }
    dispatch(makeThumbnail(id));
  };

  const renderRow = (label: string, value?: any) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <Box sx={{ display: 'flex', mb: 1 }}>
        <Typography sx={{ mr: 2 }} variant="caption">
          {label}:
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}>
          {String(value)}
        </Typography>
      </Box>
    );
  };

  const showThumbnail =
    thumbnail &&
    thumbnail.trim() !== '' &&
    thumbnail.trim().toLowerCase() !== 'generating...' &&
    thumbnail.trim().toLowerCase() !== 'error';

  const isErrorThumbnail =
    thumbnail && thumbnail.trim().toLowerCase() === 'error';

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
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                {truncatedText}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {showThumbnail ? (
                <Card sx={{ display: 'flex', mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid xs={4}>
                      <CardMedia
                        component="img"
                        sx={{ width: '100%', height: 'auto' }}
                        image={`/png/thumbnails/${thumbnail}`}
                        alt="PDF thumbnail"
                      />
                    </Grid>
                    <Grid xs={8}>
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
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
                        {renderRow('Size', formatFileSize(filesize))}
                        {renderRow('Type', mimeType)}
                        <pre>row: {JSON.stringify(row, null, 2)}</pre>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {isErrorThumbnail && (
                    <Box sx={{ mb: 2 }}>
                      <Skeleton variant="rectangular" width="100%" height={120} />
                    </Box>
                  )}
                  <MightyButton
                    sx={{ my: 2 }}
                    variant="outlined"
                    icon="photo"
                    label="Generate Thumbnail"
                    color="primary"
                    onClick={handleMakeThumbnail}
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* RIGHT: Action buttons */}
        <Stack direction="row" spacing={1} sx={{ pt: 1, mr: 1 }}>
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
