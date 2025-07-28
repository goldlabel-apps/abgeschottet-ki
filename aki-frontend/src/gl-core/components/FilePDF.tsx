'use client';

import * as React from 'react';
import moment from 'moment';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardHeader,
  Alert,
  ButtonBase,
  Link as MuiLink,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  useDispatch,
  MightyButton,
  rip,
  summarise,
} from '../../gl-core';
import { deletePDF } from '../components/DB';
import { useKIBus } from '../../gl-core/hooks/useKIBus';
import { AddBox } from '@mui/icons-material';

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
    summary?: string | null;
    [key: string]: any;
  };
}

export default function FilePDF({ data }: RowPDFProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const kiBus = useKIBus();
  const kiBusEntry = data?.id ? kiBus?.[data.id] : null;

  const handleDelete = () => {
    if (data?.id) {
      dispatch(deletePDF(data.id as any));
    }
  };

  const handleRip = () => {
    if (data?.id) {
      dispatch(rip(data.id as any));
    }
  };

  const handleSummarise = () => {
    if (data?.id) {
      dispatch(summarise(data.id));
    }
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

  const summary = data?.summary ?? '';
  const hasSummary = summary.trim().length > 0;
  const summaryIsError = summary.startsWith('[ERROR]');

  return (
    <Card sx={{ mb: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>

          <CardHeader 
            title={<Typography
                      variant="h6"
                    >
                      {data?.label ?? 'Untitled PDF'}
                    </Typography>}
            action={<>
                    <MightyButton
                      mode="icon"
                      label="Delete"
                      icon="delete"
                      onClick={handleDelete}
                    />
                  </>}
          />

          
          
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
              alignItems: 'flex-start',
              p: 2,
            }}
          >
            <Box sx={{ width: '100%', aspectRatio: '3 / 4' }}>
              <ButtonBase
                component="a"
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <CardMedia
                  component="img"
                  image={thumbnailUrl}
                  alt={`Thumbnail for ${data?.label ?? data?.filename}`}
                  sx={{
                    objectFit: 'contain',
                    m: 1,
                    alignSelf: 'flex-start',
                  }}
                />
              </ButtonBase>
            </Box>
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
          {hasSummary ? (
            summaryIsError ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                {summary.replace(/^\[ERROR\]\s*/, '')}
              </Alert>
            ) : (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">{summary}</Typography>
              </Box>
            )
          ) : (
            <Alert severity="warning" sx={{ mb: 1 }}>
              No summary available
            </Alert>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Updated {data?.updated ? moment(data.updated).fromNow() : 'Unknown'}
          </Typography>

          {rawTextIsError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rawText.replace(/^\[ERROR\]\s*/, '')}
            </Alert>
          ) : (
            <>
              {!hasRawText && (
                <MightyButton
                  icon="pdf"
                  variant="contained"
                  label="Extract rawText"
                  onClick={handleRip}
                  sx={{ my: 2, alignSelf: 'flex-start' }}
                />
              )}
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

          {/* {kiBusEntry && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight="bold">
                kiBus entry:
              </Typography>
              <pre>{JSON.stringify(kiBusEntry, null, 2)}</pre>
            </Box>
          )} */}
        </Grid>
      </Grid>
    </Card>
  );
}
