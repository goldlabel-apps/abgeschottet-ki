'use client';

import * as React from 'react';
import { useDispatch, useSlice, MightyButton } from '../../../gl-core';
import { updatePrompt } from '../../actions/updatePrompt';
import {
  TextField,
  IconButton,
  InputAdornment,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Icon } from '../../cartridges/Theme';

export const guidelineOptions = [
  { label: 'Reply in English', guideline: 'Reply in English' },
  { label: 'Reply like a pirate', guideline: 'Speak like a pirate' },
  { label: 'Reply in German', guideline: 'Reply in German' },
];

export const youOptions = [
  { label: 'German Lawyer', you: 'You are a German lawyer with 20 years experience' },
  { label: 'Senior JavaScript Developer', you: 'You are Sempai, a software developer with 20 years experience' },
  { label: 'Therapist', you: 'You are a therapist with 20 years experience specializing in CBT,'},
];

export const meOptions = [
  { label: 'Rechtsanwaltsfachangestellte', me: 'I am an intern learning to be a paralegal' },
  { label: 'Junior JavaScript Developer', me: 'I am Kohai, a junior JavaScript developer with 2 years experience' },
  { label: 'Lost Soul', me: 'I am a lost soul, struggling to make sense of the world. I need help and support' },
];

function buildPrompt(prompt?: {
  you?: string;
  me?: string;
  guidelines?: string;
  query?: string;
}): string {
  const { you = '', me = '', guidelines = '', query = '' } = prompt || {};
  return `
${you.trim()}

${me.trim()}

Guidelines: Keeping your response as consise as possible, ${guidelines.trim()}

Kohai says: "${query.trim()}"
`.trim();
}

interface PromptBuilderProps {
  onSubmit?: (compiled: string) => void;
}

export default function PromptBuilder({ onSubmit }: PromptBuilderProps) {
  const dispatch = useDispatch();
  const { prompt } = useSlice() || {};

  React.useEffect(() => {
    if (!prompt?.you) dispatch(updatePrompt('you', youOptions[0].you));
    if (!prompt?.me) dispatch(updatePrompt('me', meOptions[0].me));
    if (!prompt?.guidelines) dispatch(updatePrompt('guidelines', guidelineOptions[0].guideline));
  }, [dispatch, prompt]);

  const isFieldValid = (val?: string) => !!val && val.trim().length >= 10;
  const allValid =
    isFieldValid(prompt?.you) &&
    isFieldValid(prompt?.me) &&
    isFieldValid(prompt?.guidelines) &&
    isFieldValid(prompt?.query);

  const handleChange = (key: string) => (e: any) => {
    dispatch(updatePrompt(key, e.target.value));
  };

  const handleReset = (key: string) => () => {
    dispatch(updatePrompt(key, ''));
  };

  const compiled = buildPrompt(prompt || { you: '', me: '', guidelines: '', query: '' });

  const handleSubmit = () => {
    if (onSubmit && allValid) {
      onSubmit(compiled);
    }
  };

  const renderField = (label: string, key: keyof typeof prompt, autoFocus?: boolean) => {
    const value = (prompt?.[key] as string) || '';
    const valid = isFieldValid(value);
    return (
      <Box key={key}>
        <TextField
          label={label}
          multiline
          rows={4}
          variant="filled"
          fullWidth
          autoFocus={autoFocus}
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
    <Box sx={{ width: '100%' }}>
      {/* Query first */}
      {renderField('Prompt', 'query', true)}

      {/* Send button */}
      <Box mb={3}>
        <MightyButton
          variant="contained"
          icon="ai"
          iconPlacement="right"
          label="Send Prompt"
          color="primary"
          onClick={handleSubmit}
          disabled={!allValid}
        />
      </Box>

      {/* Dropdowns underneath, not full width, spaced out */}
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="you-select-label">KI Persona</InputLabel>
          <Select
            variant="filled"
            labelId="you-select-label"
            value={prompt?.you || youOptions[0].you}
            onChange={handleChange('you')}
          >
            {youOptions.map((opt) => (
              <MenuItem key={opt.label} value={opt.you}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="me-select-label">Your Persona</InputLabel>
          <Select
            variant="filled"
            labelId="me-select-label"
            value={prompt?.me || meOptions[0].me}
            onChange={handleChange('me')}
          >
            {meOptions.map((opt) => (
              <MenuItem key={opt.label} value={opt.me}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel id="guidelines-select-label">Extras</InputLabel>
          <Select
            variant="filled"
            labelId="guidelines-select-label"
            value={prompt?.guidelines || guidelineOptions[0].guideline}
            onChange={handleChange('guidelines')}
          >
            {guidelineOptions.map((opt) => (
              <MenuItem key={opt.label} value={opt.guideline}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
