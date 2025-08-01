// aki/aki-frontend/src/gl-core/components/FilePDF.tsx
'use client';

import * as React from 'react';
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
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  useDispatch,
  MightyButton,
  rip,
  summarise,
  cancelOperation,
} from '../../gl-core';
import { deletePDF } from '../components/DB';
import { useKIBus } from '../../gl-core/hooks/useKIBus';

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
  const isFetching = kiBusEntry?.fetching === true;

  const [analysing, setAnalysing] = React.useState(false);
  const [localSummary, setLocalSummary] = React.useState(data?.summary ?? '');
  const [showFullSummary, setShowFullSummary] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const startRef = React.useRef<number | null>(null);

  const rawText = data?.rawText ?? '';
  const summary = localSummary.trim();

  const hasRawText = rawText.trim().length > 0;
  const rawTextIsError = rawText.startsWith('[ERROR]');
  const hasSummary = summary.length > 0;
  const summaryIsError = summary.startsWith('[ERROR]');

  const handleDelete = () => {
    if (data?.id) dispatch(deletePDF(data.id));
  };

  const handleRip = () => {
    if (data?.id) dispatch(rip(data.id));
  };

  const handleSummarise = () => {
    if (!data?.id) return;
    if (localSummary) setLocalSummary('');
    setAnalysing(true);
    dispatch(summarise(data.id));
  };

  const handleCancel = () => {
    if (data?.id) dispatch(cancelOperation(data.id));
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (analysing) {
      startRef.current = Date.now();
      interval = setInterval(() => {
        if (startRef.current) {
          setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }
      }, 1000);
    } else {
      setElapsed(0);
      startRef.current = null;
    }

    return () => clearInterval(interval);
  }, [analysing]);

  React.useEffect(() => {
    if (data?.summary) {
      setAnalysing(false);
      setLocalSummary(data.summary);
    }

    if (summaryIsError || rawTextIsError) {
      setAnalysing(false);
    }
  }, [data?.summary, summaryIsError, rawTextIsError]);

  const hasErrorThumbnail =
    typeof data?.thumbnail === 'string' && data.thumbnail.startsWith('[ERROR]');
  const errorMessage = hasErrorThumbnail
    ? data.thumbnail.replace(/^\[ERROR\]\s*/, '')
    : null;
  const isValidThumbnail =
    typeof data?.thumbnail === 'string' && !hasErrorThumbnail;

  const thumbnailUrl = isValidThumbnail ? `/png/thumbnails/${data?.thumbnail}` : null;
  const pdfUrl = `/pdf/uploads/${data?.fileNameOnDisk}`;
  const truncatedSummary =
    summary.length > 480 ? summary.slice(0, 480).trimEnd() + '…' : summary;

  return (
    <Card sx={{ mb: 1 }}>
      {isFetching && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid size={12}>
          <CardHeader
            title={
              <Typography variant="h6">
                {data?.label ?? 'Untitled PDF'}
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                {isFetching && (
                  <MightyButton
                    mode="icon"
                    label="Cancel"
                    icon="cancel"
                    onClick={handleCancel}
                    disabled={!isFetching}
                  />
                )}
                <MightyButton
                  mode="icon"
                  label="Delete"
                  icon="delete"
                  onClick={handleDelete}
                  disabled={isFetching}
                />
              </Box>
            }
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
                  sx={{ objectFit: 'contain', m: 1, alignSelf: 'flex-start' }}
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
          {analysing ? (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Analysing... {elapsed}s
            </Typography>
          ) : hasSummary ? (
            summaryIsError ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                {summary.replace(/^\[ERROR\]\s*/, '')}
              </Alert>
            ) : (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" paragraph>
                  {showFullSummary ? summary : truncatedSummary}
                  {summary.length > 480 && (
                    <MuiLink
                      component="button"
                      variant="body2"
                      onClick={() => setShowFullSummary(!showFullSummary)}
                      sx={{ ml: 1 }}
                    >
                      {showFullSummary ? 'less' : 'more'}
                    </MuiLink>
                  )}
                </Typography>
              </Box>
            )
          ) : !analysing ? (
            <Alert severity="success" sx={{ mb: 1 }}>
              <Typography variant="body2">Analyse/Summarise</Typography>
              <MightyButton
                label="Run"
                icon="ki"
                variant="contained"
                onClick={handleSummarise}
                sx={{ my: 2, alignSelf: 'flex-start' }}
                disabled={isFetching}
              />
            </Alert>
          ) : null}

          {rawTextIsError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rawText.replace(/^\[ERROR\]\s*/, '')}
            </Alert>
          ) : (
            !hasRawText && (
              <MightyButton
                icon="pdf"
                variant="contained"
                label="Extract rawText"
                onClick={handleRip}
                sx={{ my: 2, alignSelf: 'flex-start' }}
                disabled={isFetching}
              />
            )
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
