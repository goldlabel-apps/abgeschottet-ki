// abgeschottet-ki/aki-frontend/src/gl-core/components/Upload.tsx
'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import {
  Backdrop,
  LinearProgress,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { MightyButton, showFeedback, useDispatch, makeThumbnail } from '../../gl-core';
import { fetchTable } from './DB';

export default function Upload() {

  const dispatch = useDispatch();  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    setFile(selected);
    setError(null);
    uploadFile(selected);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const apiUrl = 'http://localhost:4000/pdf/upload';

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';

      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        dispatch(showFeedback({
          severity: "error", 
          title: `API route ${apiUrl}`,
          description: "Not found or not running"
        }));
      }
      if (!res.ok) {
        dispatch(showFeedback({
          severity: "error", 
          title: `Upload failed`,
          description: `Status ${res.status} from ${apiUrl}`
        }));
      }

      
      // console.log('data', data.data);
      const id = data.data?.id;
      if (id) dispatch(makeThumbnail(id));
      
      // dispatch(showFeedback({ 
      //   severity: "warning", 
      //   title: "PDF uploaded, making thumbnail...",
      //   description: "Automagically "
      // }));

      setUploading(false);
      setFile(null);

      setTimeout(() => {
        dispatch(fetchTable("pdfs", `http://localhost:4000/db/read/table/pdfs`) as any);
      }, 500);

    } catch (err: any) {
      // console.error('Upload failed:', err);

      dispatch(showFeedback({
        severity: "error", 
        title: `Upload failed`,
        description: `Status ${err.toString()}`,
      }));


      setError(err.message || 'Something went wrong');
      setSnackbarOpen(true);
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="application/pdf"
        onChange={handleFileChange}
      />

      {!uploading && (
        <MightyButton
          icon="upload"
          iconPlacement='right'
          label="Upload"
          variant="contained"
          onClick={handleClick}
        />
      )}

      <Backdrop
        open={uploading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Uploading{file?.name ? ` “${file.name}”...` : '...'}
          </Typography>
          <Box sx={{ width: 175, mt: 1 }}>
            <LinearProgress color="inherit" />
          </Box>
        </Box>
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
