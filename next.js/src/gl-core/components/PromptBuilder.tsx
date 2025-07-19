'use client';

import * as React from 'react';
import { useDispatch, useSlice } from '../../gl-core';
import { updatePrompt } from '../actions/updatePrompt';

import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '../cartridges/Theme';

// helper to compile prompt
function buildPrompt(prompt: {
  you: string;
  me: string;
  guidelines: string;
  query: string;
}): string {
  const { you = '', me = '', guidelines = '', query = '' } = prompt;
  return `
${you.trim()}

${me.trim()}

Guidelines: ${guidelines.trim()}

Kohai says: "${query.trim()}"
`.trim();
}

interface PromptBuilderProps {
  onSubmit?: (compiled: string) => void;
}

export default function PromptBuilder({ onSubmit }: PromptBuilderProps) {
  const dispatch = useDispatch();
  const { prompt } = useSlice();

  const isFieldValid = (val?: string) => !!val && val.trim().length >= 10;
  const allValid =
    isFieldValid(prompt?.you) &&
    isFieldValid(prompt?.me) &&
    isFieldValid(prompt?.guidelines) &&
    isFieldValid(prompt?.query);

  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePrompt(key, e.target.value));
  };

  const handleReset = (key: string) => () => {
    dispatch(updatePrompt(key, ''));
  };

  const compiled = buildPrompt(prompt);

  const handleSubmit = () => {
    if (onSubmit && allValid) {
      onSubmit(compiled);
    }
  };

  const renderField = (label: string, key: keyof typeof prompt) => {
    const value = (prompt?.[key] as string) || '';
    const valid = isFieldValid(value);
    return (
      <Box mb={2} key={key}>
        <TextField
          label={label}
          variant="outlined"
          fullWidth
          value={value}
          onChange={handleChange(key)}
          error={!valid && value.length > 0}
          helperText={
            !valid && value.length > 0 ? 'Must be at least 10 characters' : ' '
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {value && value.length > 0 && (
                  <IconButton onClick={handleReset(key)} edge="end">
                    <CloseIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader
        avatar={<Icon icon="prompt" color="primary" />}
        title="Prompt Builder"
        subheader="Break the prompt down"
      />
      <CardContent>
        {renderField('You', 'you')}
        {renderField('Me', 'me')}
        {renderField('Guidelines', 'guidelines')}
        {renderField('Query', 'query')}

        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!allValid}
          >
            Submit
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
}
