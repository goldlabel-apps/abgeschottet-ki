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
import { MightyButton, showFeedback, useDispatch } from '../../gl-core';

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
        // Non-JSON response (likely a 404 HTML page)
        throw new Error(
          `API route ${apiUrl} was not found or the backend isn't running.`
        );
      }

      if (!res.ok) {
        throw new Error(
          data?.error ||
            `Upload failed with status ${res.status} from ${apiUrl}`
        );
      }

      console.log('data.data', data.data);
      const {severity, title, description} = data;
      dispatch(showFeedback({severity, title, description}))
      setUploading(false);
      setFile(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
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
          mode="icon"
          icon="upload"
          iconPlacement='right'
          label="Upload PDF"
          variant="outlined"
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
