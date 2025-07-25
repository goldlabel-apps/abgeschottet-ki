// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/Feedback.tsx
'use client';

import * as React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import {
  useFeedback,
  useDispatch,
  showFeedback,
  Icon,
} from '../../gl-core';

export default function Feedback({}: any) {
  const feedback = useFeedback();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (feedback && !feedback.hidden) {
      const timer = setTimeout(() => {
        // console.log('toggleFeedback(null)');
        dispatch(showFeedback(null));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [feedback, dispatch]);

  if (!feedback || feedback.hidden) return null;

  const { title, description, severity } = feedback;

  const handleClose = () => {
    dispatch(showFeedback(null));
  };

  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert
        severity={severity}
        sx={{ minWidth: 250 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <Icon icon="close" />
          </IconButton>
        }
      >
        <strong>{title}</strong>
        <br />
        {description}
      </Alert>
    </Snackbar>
  );
}
