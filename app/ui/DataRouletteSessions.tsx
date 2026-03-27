'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TableRouletteSessions from '@/app/ui/TableRouletteSessions';
import { getApiUrl, useApiEnv } from '@/app/lib/api-env';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a2827',
    },
  },
});

function toInt(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function normalizeSessions(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidate = payload as {
    sessions?: unknown;
    items?: unknown;
    Items?: unknown;
  };

  if (Array.isArray(candidate.sessions)) return candidate.sessions;
  if (Array.isArray(candidate.items)) return candidate.items;
  if (Array.isArray(candidate.Items)) return candidate.Items;
  return [];
}

export type RouletteSessionRow = {
  id: string;
  sessionId: string;
  userId: string;
  eventsCount: number;
  moviesSwipedCount: number;
  moviesLikedCount: number;
  moviesIgnoredCount: number;
  moviesToBeSeenCount: number;
  moviesViewedCount: number;
  mixId: string;
  durationSec: number;
  startedAt: number;
  endedAt: number;
  lastEventAt: number;
};

function toRows(items: unknown[]): RouletteSessionRow[] {
  return items.map((item, index) => {
    const raw =
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : ({ value: item } as Record<string, unknown>);

    const sessionId =
      typeof raw.sessionId === 'string' && raw.sessionId.trim()
        ? raw.sessionId
        : `unknown-${index}`;

    return {
      id: sessionId,
      sessionId,
      userId: typeof raw.userId === 'string' && raw.userId.trim() ? raw.userId : 'anonymous',
      eventsCount: toInt(raw.eventsCount),
      moviesSwipedCount: toInt(raw.moviesSwipedCount),
      moviesLikedCount: toInt(raw.moviesLikedCount),
      moviesIgnoredCount: toInt(raw.moviesIgnoredCount),
      moviesToBeSeenCount: toInt(raw.moviesToBeSeenCount),
      moviesViewedCount: toInt(raw.moviesViewedCount),
      mixId: typeof raw.mixId === 'string' ? raw.mixId : '-',
      durationSec: toInt(raw.durationSec),
      startedAt: toInt(raw.startedAt),
      endedAt: toInt(raw.endedAt),
      lastEventAt: toInt(raw.lastEventAt),
    };
  });
}

export default function DataRouletteSessions() {
  const [rows, setRows] = useState<RouletteSessionRow[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiEnv } = useApiEnv();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/admin/roulette/sessions?limit=100', apiEnv));
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data?.error === 'string' ? data.error : `HTTP ${res.status}`);
          setRows([]);
          return;
        }
        setRows(toRows(normalizeSessions(data)));
        setError(null);
      } catch (e) {
        console.error('Failed to fetch roulette sessions', e);
        setRows([]);
        setError('Impossible de charger les sessions roulette');
      } finally {
        setLoading(false);
      }
    };

    const id = setInterval(fetchData, 30000);
    fetchData();

    return () => clearInterval(id);
  }, [apiEnv]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="white">
            Roulette Sessions
          </Typography>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Paper elevation={3}>
            <TableRouletteSessions rows={rows} isLoading={isLoading} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

