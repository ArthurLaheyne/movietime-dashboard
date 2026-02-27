'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TableSessionEvents from '@/app/ui/TableSessionEvents';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a2827',
    },
  },
});

type SessionEventRow = {
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

function toRows(items: unknown[]): SessionEventRow[] {
  return items.map((item, index) => {
    const row =
      item && typeof item === 'object' ? { ...(item as Record<string, unknown>) } : { value: item };

    for (const key of Object.keys(row)) {
      const value = row[key];
      if (value && typeof value === 'object') {
        row[key] = JSON.stringify(value);
      }
    }

    const id =
      (typeof row.id === 'string' && row.id) ||
      (typeof row.sk === 'string' && row.sk) ||
      `${index}-${String(row.ts ?? row.name ?? 'event')}`;

    return { id, ...row };
  });
}

export default function DataSessionEvents({ sessionId }: { sessionId: string }) {
  const [rows, setRows] = useState<SessionEventRow[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/events/session/${encodeURIComponent(sessionId)}`,
        );
        const data = await res.json();
        if (!res.ok) {
          setError(typeof data?.error === 'string' ? data.error : `HTTP ${res.status}`);
          setRows([]);
          return;
        }
        console.log(toRows(normalizeItems(data)));
        
        setRows(toRows(normalizeItems(data)));
      } catch (e) {
        console.error('Failed to fetch session events', e);
        setError('Failed to fetch session events');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Link href="/sessions">Retour aux sessions</Link>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Session: {sessionId}</Typography>
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
