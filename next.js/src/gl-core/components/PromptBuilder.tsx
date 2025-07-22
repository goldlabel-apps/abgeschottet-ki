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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Typography,
} from '@mui/material';
import { Icon } from '../cartridges/Theme';
import { MightyButton } from '../../gl-core';

export const guidelineOptions = [
  {
    label: 'Reply like a pirate',
    guideline: 'Speak like a pirate',
  },
  {
    label: 'Reply in German',
    guideline: 'Reply in German',
  },
];

export const youOptions = [
  {
    label: 'German Lawyer',
    you: 'You are a German lawyer with 20 years experience',
  },
  {
    label: 'Senior Developer',
    you: 'You are Sempai, a software developer with 20 years experience',
  },
];

export const meOptions = [
  {
    label: 'Junior Developer',
    me: 'I am Kohai, a junior JavaScript developer with 2 years experience',
  },
  {
    label: 'Junior Lawyer',
    me: 'I am Kohai, currently an intern learning frontend development',
  },
];

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
          multiline
          rows={4}
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
                    <Icon icon="close" />
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
        avatar={<Icon icon="ai" />}
        title="You Say..."
      />
      <CardContent>
        {/* QUERY first */}
        {renderField('Query', 'query')}

        <Grid container spacing={2}>
          {/* KI Persona */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">KI Persona</FormLabel>
              <RadioGroup
                value={prompt?.you || ''}
                onChange={(e) => dispatch(updatePrompt('you', e.target.value))}
              >
                {youOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.label}
                    value={opt.you}
                    control={<Radio />}
                    label={
                      <Typography variant="caption">{opt.label}</Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Your Persona */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Your Persona</FormLabel>
              <RadioGroup
                value={prompt?.me || ''}
                onChange={(e) => dispatch(updatePrompt('me', e.target.value))}
              >
                {meOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.label}
                    value={opt.me}
                    control={<Radio />}
                    label={
                      <Typography variant="caption">{opt.label}</Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Extras */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Extras</FormLabel>
              <RadioGroup
                value={prompt?.guidelines || ''}
                onChange={(e) =>
                  dispatch(updatePrompt('guidelines', e.target.value))
                }
              >
                {guidelineOptions.map((opt) => (
                  <FormControlLabel
                    key={opt.label}
                    value={opt.guideline}
                    control={<Radio />}
                    label={
                      <Typography variant="caption">{opt.label}</Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        <Box mt={2}>
          <MightyButton
            variant="contained"
            icon="ai"
            iconPlacement="right"
            label="Start KI"
            color="primary"
            onClick={handleSubmit}
            disabled={!allValid}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
