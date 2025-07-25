// /Users/goldlabel/GitHub/abgeschottet-ki/next.js/src/gl-core/components/DB/DB.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import { useSlice, useDispatch, Icon, MightyButton } from '../../../gl-core';
import { fetchSchema } from '../DB';
export type TDB = {
  mode?: 'default' | 'icon' | null;
};

export default function DB({ mode = 'default' }: TDB) {
  const { db } = useSlice();
  const router = useRouter();
  const dispatch = useDispatch();

  // ✅ According to your state shape
  const tables: string[] = db?.schema?.tables ?? [];
  const schemas: Record<string, any> = db?.schema?.schema ?? {};

  const handleClick = (tableName: string) => {
    router.push(`/database/table/${tableName}`);
  };

  const handleReload = () => {
    dispatch(fetchSchema('schema', 'http://localhost:4000/db/schema') as any);
  };

  return (
    <Box sx={{ p: 2 }}>
      <CardHeader
        avatar={<Icon icon="database" color="primary" />}
        title="Database"
        action={<MightyButton 
                  mode="icon"
                  label="Reload"
                  color="primary"
                  variant='outlined'
                  icon="reset"
                  iconPlacement='right'
                  onClick={handleReload}
                />}
      />

      <Grid container spacing={2} columns={12}>
        {tables.map((tableName) => {
          // schema[tableName] looks like [ [ "0", {name, type, ...}], [ "1", {name,type,...}] ]
          const schemaArray: [string, any][] = Object.entries(schemas?.[tableName] || {});

          return (
            <Grid key={tableName} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined">
                <CardActionArea onClick={() => handleClick(tableName)}>
                  <CardHeader
                    title={tableName}
                  />
                  <Divider />
                  <CardContent>
                    {schemaArray.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        No schema info available.
                      </Typography>
                    )}
                    {schemaArray.slice(0, 5).map(([_, field]) => (
                      <Typography
                        key={field.cid}
                        variant="body2"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>{field.name}</strong>: {field.type}
                        {field.pk ? ' (PK)' : ''} {field.notnull ? ' NOT NULL' : ''}
                      </Typography>
                    ))}
                    {schemaArray.length > 5 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        …more fields
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
