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
  Alert,
  Skeleton,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface RowPDFProps {
  data?: {
    id: number;
    filename: string;
    fileNameOnDisk: string;
    thumbnail?: string;
    createdAt?: string;
    [key: string]: any;
  };
}

export default function RowPDF({ data }: RowPDFProps) {
  // console.log("data", data)
  if (!data) return null;

  const { id, filename, fileNameOnDisk, thumbnail, createdAt } = data;

  const isError = typeof thumbnail === 'string' && thumbnail.startsWith('[ERROR]');
  const errorMessage = isError ? thumbnail.replace(/^\[ERROR\]\s*/, '') : null;
  const thumbnailUrl =
    thumbnail && !isError ? `/png/thumbnails/${thumbnail}` : null;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{filename || fileNameOnDisk}</Typography>
          {createdAt && (
            <Typography variant="body2" color="text.secondary">
              {moment(createdAt).format('YYYY-MM-DD HH:mm')}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 2 }} />
        {isError ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : thumbnailUrl ? (
          <Card sx={{ maxWidth: 240 }}>
            <CardMedia
              component="img"
              image={thumbnailUrl}
              alt={`Thumbnail for ${filename}`}
            />
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Preview thumbnail
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Skeleton variant="rectangular" width={240} height={1200 * (240 / 630)} />
        )}
      </AccordionDetails>
    </Accordion>
  );
}
