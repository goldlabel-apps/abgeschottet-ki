// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/PdfSmashUpload.tsx

'use client';

import * as React from 'react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Backdrop, LinearProgress, Typography, Box, Button } from '@mui/material';

export default function PdfSmashUpload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (!selected) return;

    setFile(selected);
    setError(null);
    uploadFile(selected);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Adjust this URL if your Next.js API will proxy to pdf-smash
      const res = await fetch('http://localhost:4000/process-pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      console.log('Upload success:', data);
      // e.g. redirect or show success
      // router.push(`/pdfs/${data.id}`); // implement as needed

      setUploading(false);
      setFile(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Something went wrong');
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleClick}
          startIcon={<span style={{ fontSize: '1.2em' }}>📄</span>}
        >
          Upload PDF
        </Button>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
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
    </>
  );
}
