'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TableSessionEvents from '@/app/ui/TableSessionEvents';
import { getApiUrl, useApiEnv } from '@/app/lib/api-env';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a2827',
    },
  },
});

type RouletteSessionEventRow = {
  id: string;
  [key: string]: unknown;
};

function normalizeItems(payload: unknown): unknown[] {
  if (!payload || typeof payload !== 'object') return [];
  const candidate = payload as { items?: unknown; Items?: unknown };
  if (Array.isArray(candidate.items)) return candidate.items;
  if (Array.isArray(candidate.Items)) return candidate.Items;
  return [];
}

function toRows(items: unknown[]): RouletteSessionEventRow[] {
  return items.map((item, index) => {
    const row: Record<string, unknown> =
      item && typeof item === 'object'
        ? { ...(item as Record<string, unknown>) }
        : { value: item };

    for (const key of Object.keys(row)) {
      const value = row[key];
      if (value && typeof value === 'object') {
        row[key] = JSON.stringify(value);
      }
    }

    const id =
      (typeof row.id === 'string' && row.id) ||
      (typeof row.sk === 'string' && row.sk) ||
      `${index}-${String(row.ts ?? row.eventName ?? row.name ?? 'event')}`;

    return { id, ...row } as RouletteSessionEventRow;
  });
}

export default function DataRouletteSessionEvents({ sessionId }: { sessionId: string }) {
  const [rows, setRows] = useState<RouletteSessionEventRow[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiEnv } = useApiEnv();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          getApiUrl(`/admin/roulette/sessions/${encodeURIComponent(sessionId)}/events`, apiEnv),
        );
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data?.error === 'string' ? data.error : `HTTP ${res.status}`);
          setRows([]);
          return;
        }
        setRows(toRows(normalizeItems(data)));
      } catch (e) {
        console.error('Failed to fetch roulette session events', e);
        setError('Impossible de charger les events de la session roulette');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, apiEnv]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Link href="/roulette-sessions">Retour aux sessions roulette</Link>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="white">
            Roulette Session: {sessionId}
          </Typography>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Paper elevation={3}>
            <TableSessionEvents rows={rows} isLoading={isLoading} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
