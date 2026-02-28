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

const formatDateMs = (v: unknown) => {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n) || n <= 0) return '-';
  return new Date(n).toLocaleString();
};

export type SessionRow = {
  id: string;
  sessionId?: string;

  // Champs visibles
  userId: string;
  eventCount: number;
  context: string;
  firstSeen: string;
  lastSeen: string;
};

function toGridRows(items: unknown[]): SessionRow[] {
  return items.map((item, index) => {
    const raw =
      item && typeof item === 'object'
        ? (item as Record<string, unknown>)
        : ({ value: item } as Record<string, unknown>);

    const sessionId = extractSessionId(raw);

    const userId =
      (typeof raw.userId === 'string' && raw.userId.trim()) ? raw.userId : 'anonymous';

    const eventCount =
      typeof raw.eventCount === 'number'
        ? raw.eventCount
        : Number(raw.eventCount ?? 0) || 0;

    const context =
      raw.context && typeof raw.context === 'object'
        ? JSON.stringify(raw.context)
        : (typeof raw.context === 'string' ? raw.context : '{}');

    const firstSeen = formatDateMs(raw.firstSeenAt);
    const lastSeen = formatDateMs(raw.lastSeenAt);

    const id = sessionId || `${index}`;

    return {
      id,
      sessionId,
      userId,
      eventCount,
      context,
      firstSeen,
      lastSeen,
    };
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