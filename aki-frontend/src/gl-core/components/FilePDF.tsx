'use client';

import * as React from 'react';
import moment from 'moment';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Alert,
} from '@mui/material';
import {
  useDispatch,
  MightyButton,
} from '../../gl-core';
import { deletePDF } from '../components/DB';

interface RowPDFProps {
  data?: {
    id: number;
    label?: string;
    slug?: string;
    filename: string;
    fileNameOnDisk: string;
    thumbnail?: string;
    updated?: number | string;
    createdAt?: string;
    [key: string]: any;
  };
}

export default function FilePDF({ data }: RowPDFProps) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deletePDF(data?.id as any));
  };

  const hasErrorThumbnail =
    typeof data?.thumbnail === 'string' && data.thumbnail.startsWith('[ERROR]');

  const errorMessage = hasErrorThumbnail
    ? data!.thumbnail!.replace(/^\[ERROR\]\s*/, '')
    : null;

  const isValidThumbnail =
    typeof data?.thumbnail === 'string' && !hasErrorThumbnail;

  const thumbnailUrl = isValidThumbnail ? `/png/thumbnails/${data?.thumbnail}` : null;

  return (
    <Box sx={{ mb: 2 }}>
      <AppBar position="static" color="default" elevation={1} sx={{ mb: 2 }}>
        <Toolbar variant="dense" sx={{ justifyContent: 'flex-start', gap: 1 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ ml: 2, flexGrow: 1, userSelect: 'text' }}
            title={data?.label}
          >
            {data?.label ?? 'Untitled PDF'}
          </Typography>

          <MightyButton
            mode="icon"
            label="Delete"
            icon="delete"
            onClick={handleDelete}
          />
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        {hasErrorThumbnail ? (
          <Grid size={12}>
            <Alert severity="error">Thumbnail Gemeration Error: {errorMessage}</Alert>
          </Grid>
        ) : thumbnailUrl ? (
          <Grid
            size={{ xs: 12, sm: 4, md: 3 }}
            sx={{
              maxWidth: 180,
              flexBasis: '40%',
              flexGrow: 0,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Card sx={{ width: '100%', aspectRatio: '3 / 4' /* portrait */ }}>
              <CardMedia
                component="img"
                image={thumbnailUrl}
                alt={`Thumbnail for ${data?.label ?? data?.filename}`}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>
        ) : null}

        <Grid
          size={{
            xs: 12,
            sm: hasErrorThumbnail || !thumbnailUrl ? 12 : 8,
            md: hasErrorThumbnail || !thumbnailUrl ? 12 : 9,
          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            pt: 1,
            px: 2,
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Slug:</strong> {data?.slug ?? 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Updated:</strong>{' '}
            {data?.updated
              ? moment(data.updated).fromNow()
              : 'Unknown'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
