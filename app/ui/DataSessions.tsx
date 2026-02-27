'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TableSessions from '@/app/ui/TableSessions';

const SESSIONS_URL =
  'https://hufyvhlacb.execute-api.us-west-2.amazonaws.com/events/sessions';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2a2827',
    },
  },
});

function normalizeSessions(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidate = payload as {
    Items?: unknown;
    items?: unknown;
    sessions?: unknown;
  };

  if (Array.isArray(candidate.Items)) return candidate.Items;
  if (Array.isArray(candidate.items)) return candidate.items;
  if (Array.isArray(candidate.sessions)) return candidate.sessions;

  return [];
}

function extractSessionId(row: Record<string, unknown>) {
  if (typeof row.sessionId === 'string' && row.sessionId) return row.sessionId;
  if (typeof row.pk === 'string' && row.pk.startsWith('S#')) return row.pk.slice(2);
  return undefined;
}

export type SessionRow = {
  id: string;
  sessionId?: string;
  [key: string]: unknown;
};

function toGridRows(items: unknown[]): SessionRow[] {
  return items.map((item, index) => {
    const row =
      item && typeof item === 'object' ? { ...(item as Record<string, unknown>) } : { value: item };

    const sessionId = extractSessionId(row);
    if (sessionId) {
      row.sessionId = sessionId;
    }

    for (const key of Object.keys(row)) {
      const value = row[key];
      if (value && typeof value === 'object') {
        row[key] = JSON.stringify(value);
      }
    }

    const id =
      (typeof row.id === 'string' && row.id) ||
      (typeof row.sessionId === 'string' && row.sessionId) ||
      (typeof row.pk === 'string' && row.pk) ||
      `${index}-${String(row.ts ?? row.lastTs ?? row.createdAt ?? 'session')}`;

    return { id, ...row };
  });
}

export default function DataSessions() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(SESSIONS_URL);
        const data = await res.json();
        setSessions(toGridRows(normalizeSessions(data)));
      } catch (error) {
        console.error('Failed to fetch sessions', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    const id = setInterval(fetchData, 30000);
    fetchData();

    return () => clearInterval(id);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box>
          <Paper elevation={3}>
            <TableSessions sessions={sessions} isLoading={isLoading} />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
