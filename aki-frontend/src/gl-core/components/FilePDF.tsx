'use client';

import * as React from 'react';
import moment from 'moment';
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardMedia,
  Alert,
  ButtonBase,
  Link as MuiLink,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  useDispatch,
  MightyButton,
  rip,
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
    rawText?: string | null;
    [key: string]: any;
  };
}

export default function FilePDF({ data }: RowPDFProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = () => {
    dispatch(deletePDF(data?.id as any));
  };

  const handleRip = () => {
    dispatch(rip(data?.id as any));
  };

  // Placeholder for summarise handler (implement as needed)
  const handleSummarise = () => {
    // e.g. dispatch(summarise(data?.id));
    console.log('Summarise clicked for id:', data?.id);
  };

  const hasErrorThumbnail =
    typeof data?.thumbnail === 'string' && data.thumbnail.startsWith('[ERROR]');
  const errorMessage = hasErrorThumbnail
    ? data!.thumbnail!.replace(/^\[ERROR\]\s*/, '')
    : null;
  const isValidThumbnail =
    typeof data?.thumbnail === 'string' && !hasErrorThumbnail;

  const thumbnailUrl = isValidThumbnail ? `/png/thumbnails/${data?.thumbnail}` : null;
  const pdfUrl = `/pdf/uploads/${data?.fileNameOnDisk}`;

  const rawText = data?.rawText ?? '';
  const hasRawText = rawText.trim().length > 0;
  const rawTextIsError = rawText.startsWith('[ERROR]');

  return (
    <Card sx={{ mb: 1 }}>
      <Grid container spacing={2}>

        <Grid size={{xs:12}}>
          <MightyButton
            mode="icon"
            label="Delete"
            icon="delete"
            onClick={handleDelete}
          />
          <MuiLink
            component="button"
            onClick={() => router.push(`/pdfs/${data?.id}`)}
            underline="hover"
            sx={{ cursor: 'pointer' }}
          >
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, userSelect: 'text' }}
              title={data?.label}
            >
              {data?.label ?? 'Untitled PDF'}
            </Typography>
          </MuiLink>
        </Grid>

        {hasErrorThumbnail ? (
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Alert severity="error">Thumbnail Generation Error: {errorMessage}</Alert>
          </Grid>
        ) : thumbnailUrl ? (
          <Grid
            size={{ xs: 12, sm: 4, md: 3 }}
            sx={{
              maxWidth: 120,
              flexBasis: '40%',
              flexGrow: 0,
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Card sx={{ width: '100%', aspectRatio: '3 / 4' }}>
              <ButtonBase
                component="a"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: '100%', height: '100%' }}
              >
                <CardMedia
                  component="img"
                  image={thumbnailUrl}
                  alt={`Thumbnail for ${data?.label ?? data?.filename}`}
                  sx={{ objectFit: 'contain', m: 1 }}
                />
              </ButtonBase>
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
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Updated {data?.updated ? moment(data.updated).fromNow() : 'Unknown'}
          </Typography>

          {rawTextIsError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rawText.replace(/^\[ERROR\]\s*/, '')}
            </Alert>
          ) : (
            <>
              {/* Show "Extract rawText" button if no raw text */}
              {!hasRawText && (
                <MightyButton
                  icon="pdf"
                  variant="contained"
                  label="Extract rawText"
                  onClick={handleRip}
                  sx={{ my: 2, alignSelf: 'flex-start' }}
                />
              )}

              {/* Show "Summarise" button if thumbnail and rawText exist */}
              {isValidThumbnail && hasRawText && (
                <MightyButton
                  icon="ki"
                  variant="outlined"
                  label="Summarise"
                  onClick={handleSummarise}
                  sx={{ my: 2, alignSelf: 'flex-start' }}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
