'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TableRegenerates from '@/app/ui/TableRegenerates';
import { getApiUrl, useApiEnv } from '@/app/lib/api-env';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a2827',
    },
  },
});

function normalizeRuns(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidate = payload as {
    runs?: unknown;
    items?: unknown;
    Items?: unknown;
  };

  if (Array.isArray(candidate.runs)) return candidate.runs;
  if (Array.isArray(candidate.items)) return candidate.items;
  if (Array.isArray(candidate.Items)) return candidate.Items;

  return [];
}

function toInt(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export type RegenerateRunRow = {
  id: string;
  runType: string;
  triggerSource: string;
  status: string;
  statusCode: number;
  durationMs: number;
  poolsUpdatedCount: number;
  moviesTotalInjected: number;
  poolsEmptyCount: number;
  uploadedCount: number;
  createdAt: number;
  error: string | null;
};

function toRows(items: unknown[]): RegenerateRunRow[] {
  return items.map((item, index) => {
    const raw =
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : ({ value: item } as Record<string, unknown>);

    const runId =
      typeof raw.runId === 'string' && raw.runId.trim()
        ? raw.runId
        : `${raw.createdAt ?? Date.now()}-${index}`;

    return {
      id: runId,
      runType: typeof raw.runType === 'string' ? raw.runType : 'unknown',
      triggerSource: typeof raw.triggerSource === 'string' ? raw.triggerSource : 'api',
      status: typeof raw.status === 'string' ? raw.status : 'unknown',
      statusCode: toInt(raw.statusCode),
      durationMs: toInt(raw.durationMs),
      poolsUpdatedCount: toInt(raw.poolsUpdatedCount),
      moviesTotalInjected: toInt(raw.moviesTotalInjected),
      poolsEmptyCount: toInt(raw.poolsEmptyCount),
      uploadedCount: toInt(raw.uploadedCount),
      createdAt: toInt(raw.createdAt),
      error: typeof raw.error === 'string' ? raw.error : null,
    };
  });
}

export default function DataRegenerates() {
  const [rows, setRows] = useState<RegenerateRunRow[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiEnv } = useApiEnv();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl('/admin/roulette/pools/regenerate-runs?limit=100', apiEnv));
        const data = await res.json();
        setRows(toRows(normalizeRuns(data)));
        setError(null);
      } catch (e) {
        console.error('Failed to fetch regenerate runs', e);
        setRows([]);
        setError('Impossible de charger les regenerate runs');
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
          <Typography variant="h6" color="white">Roulette Pools Regenerate Runs</Typography>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}
        </Box>
        <Box>
          <Paper elevation={3}>
            <TableRegenerates rows={rows} isLoading={isLoading} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
