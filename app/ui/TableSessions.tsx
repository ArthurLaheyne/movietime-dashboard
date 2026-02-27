'use client';

import { DataGrid, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';
import TableContainer from '@mui/material/TableContainer';
import { useRouter } from 'next/navigation';
import { formatDateToLocal } from '@/app/lib/utils';
import type { SessionRow } from '@/app/ui/DataSessions';

function prettifyHeader(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, (s) => s.toUpperCase());
}

function looksLikeDateField(key: string) {
  const normalized = key.toLowerCase();
  return (
    normalized.endsWith('ts') ||
    normalized === 'ts' ||
    normalized.endsWith('at') ||
    normalized.includes('date') ||
    normalized.includes('datetime')
  );
}

function safeFormatDate(input: string) {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  try {
    return formatDateToLocal(input);
  } catch {
    return input;
  }
}

function formatCellValue(key: string, value: unknown) {
  if (value == null) return '';

  if (looksLikeDateField(key)) {
    if (typeof value === 'number') {
      const maybeMs = value > 1_000_000_000_000 ? value : value * 1000;
      return safeFormatDate(String(maybeMs));
    }
    if (typeof value === 'string') {
      return safeFormatDate(value);
    }
  }

  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

export default function TableSessions({
  sessions,
  isLoading,
}: {
  sessions: SessionRow[];
  isLoading: boolean;
}) {
  const router = useRouter();

  const keys = Array.from(new Set(sessions.flatMap((row) => Object.keys(row)))).filter(
    (key) => key !== 'id',
  );

  const priority = ['sessionId', 'userId', 'count', 'eventCount', 'firstTs', 'lastTs', 'lastEventAt'];
  keys.sort((a, b) => {
    const ia = priority.indexOf(a);
    const ib = priority.indexOf(b);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? Number.MAX_SAFE_INTEGER : ia) - (ib === -1 ? Number.MAX_SAFE_INTEGER : ib);
    }
    return a.localeCompare(b);
  });

  const columns: GridColDef[] = keys.map((key) => ({
    field: key,
    headerName: prettifyHeader(key),
    flex: 1,
    minWidth: 140,
    valueGetter: (value, row) => formatCellValue(key, row[key]),
  }));

  const handleRowClick = (params: GridRowParams<SessionRow>) => {
    const sessionId = params.row.sessionId;
    if (!sessionId || typeof sessionId !== 'string') return;
    router.push(`/sessions/${encodeURIComponent(sessionId)}`);
  };

  return (
    <TableContainer>
      <DataGrid
        slots={{
          toolbar: GridToolbar,
        }}
        loading={isLoading}
        rows={sessions}
        columns={columns}
        rowHeight={32}
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </TableContainer>
  );
}
